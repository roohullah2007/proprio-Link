<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\ContactPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Generate an invoice for a contact purchase
     */
    public function generate(ContactPurchase $purchase)
    {
        // Check if user can access this purchase
        if (auth()->user()->type_utilisateur === 'AGENT' && $purchase->agent_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this purchase');
        }

        if ($purchase->statut_paiement !== ContactPurchase::STATUS_SUCCEEDED) {
            abort(400, 'Cannot generate invoice for non-successful payments');
        }

        // Check if invoice already exists
        $existingInvoice = Invoice::where('contact_purchase_id', $purchase->id)->first();
        if ($existingInvoice) {
            return $this->downloadInvoice($existingInvoice);
        }

        // Create new invoice
        $invoice = new Invoice();
        $invoiceNumber = $invoice->generateInvoiceNumber();

        $invoiceData = [
            'invoice_number' => $invoiceNumber,
            'contact_purchase_id' => $purchase->id,
            'agent_name' => $purchase->agent->prenom . ' ' . $purchase->agent->nom,
            'agent_email' => $purchase->agent->email,
            'property_reference' => $purchase->property ? 
                $purchase->property->type_propriete . ' - ' . $purchase->property->ville : 
                'Property Reference',
            'amount' => $purchase->montant_paye,
            'currency' => $purchase->devise,
            'billing_details' => [
                'agent' => [
                    'name' => $purchase->agent->prenom . ' ' . $purchase->agent->nom,
                    'email' => $purchase->agent->email,
                    'phone' => $purchase->agent->telephone,
                    'siret' => $purchase->agent->numero_siret,
                ],
                'property' => $purchase->property ? [
                    'type' => $purchase->property->type_propriete,
                    'city' => $purchase->property->ville,
                    'price' => $purchase->property->prix,
                ] : null,
                'purchase_date' => $purchase->paiement_confirme_a,
                'stripe_payment_id' => $purchase->stripe_payment_intent_id,
            ],
            'issued_at' => now(),
        ];

        $invoice = Invoice::create($invoiceData);
        
        // Generate PDF
        $this->generatePDF($invoice);

        return $this->downloadInvoice($invoice);
    }

    /**
     * Download an existing invoice
     */
    public function downloadInvoice(Invoice $invoice)
    {
        // Check authorization
        if (auth()->user()->type_utilisateur === 'AGENT') {
            $purchase = $invoice->contactPurchase;
            if ($purchase->agent_id !== auth()->id()) {
                abort(403, 'Unauthorized access to this invoice');
            }
        }

        if ($invoice->pdf_path && Storage::exists($invoice->pdf_path)) {
            return Storage::download($invoice->pdf_path, $invoice->invoice_number . '.pdf');
        }

        // Regenerate PDF if missing
        $this->generatePDF($invoice);
        return Storage::download($invoice->pdf_path, $invoice->invoice_number . '.pdf');
    }

    /**
     * Generate PDF file for invoice
     */
    private function generatePDF(Invoice $invoice)
    {
        $pdf = Pdf::loadView('invoices.template', compact('invoice'));
        
        $filename = 'invoices/' . $invoice->invoice_number . '.pdf';
        Storage::put($filename, $pdf->output());
        
        $invoice->update(['pdf_path' => $filename]);
    }

    /**
     * Show invoice in browser (for admin)
     */
    public function show(Invoice $invoice)
    {
        // Only admin can view invoices
        if (auth()->user()->type_utilisateur !== 'ADMIN') {
            abort(403, 'Unauthorized access');
        }
        
        if (!$invoice->pdf_path || !Storage::exists($invoice->pdf_path)) {
            $this->generatePDF($invoice);
        }

        return response()->file(Storage::path($invoice->pdf_path));
    }

    /**
     * Agent index of their invoices
     */
    public function agentIndex()
    {
        $purchases = ContactPurchase::with(['property.proprietaire'])
            ->where('agent_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Agent/Invoices', [
            'purchases' => $purchases
        ]);
    }

    /**
     * Admin index of all invoices
     */
    public function adminIndex(Request $request)
    {
        try {
            // Check if invoices table exists
            if (!Schema::hasTable('invoices')) {
                return Inertia::render('Admin/Invoices', [
                    'invoices' => (object) ['data' => [], 'total' => 0, 'from' => 0, 'to' => 0, 'links' => []],
                    'stats' => [
                        'total_invoices' => 0,
                        'total_amount' => 0,
                        'invoices_this_month' => 0,
                        'amount_this_month' => 0,
                    ],
                    'filters' => $request->only(['search', 'date_from', 'date_to']),
                    'error' => 'Invoices table not found. Please run: php artisan migrate'
                ]);
            }

            $query = Invoice::with(['contactPurchase.agent', 'contactPurchase.property']);

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                      ->orWhere('agent_name', 'like', "%{$search}%")
                      ->orWhere('agent_email', 'like', "%{$search}%");
                });
            }

            // Filter by date range
            if ($request->filled('date_from')) {
                $query->whereDate('issued_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('issued_at', '<=', $request->date_to);
            }

            $invoices = $query->orderBy('issued_at', 'desc')
                              ->paginate(20)
                              ->withQueryString();

            // Statistics
            $stats = [
                'total_invoices' => Invoice::count(),
                'total_amount' => Invoice::sum('amount'),
                'invoices_this_month' => Invoice::whereMonth('issued_at', now()->month)
                                               ->whereYear('issued_at', now()->year)
                                               ->count(),
                'amount_this_month' => Invoice::whereMonth('issued_at', now()->month)
                                             ->whereYear('issued_at', now()->year)
                                             ->sum('amount'),
            ];

            return Inertia::render('Admin/Invoices', [
                'invoices' => $invoices,
                'stats' => $stats,
                'filters' => $request->only(['search', 'date_from', 'date_to'])
            ]);
            
        } catch (\Exception $e) {
            return Inertia::render('Admin/Invoices', [
                'invoices' => (object) ['data' => [], 'total' => 0, 'from' => 0, 'to' => 0, 'links' => []],
                'stats' => [
                    'total_invoices' => 0,
                    'total_amount' => 0,
                    'invoices_this_month' => 0,
                    'amount_this_month' => 0,
                ],
                'filters' => $request->only(['search', 'date_from', 'date_to']),
                'error' => 'Database error: ' . $e->getMessage()
            ]);
        }
    }
}
