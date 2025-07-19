<?php

namespace App\Console\Commands;

use App\Models\ContactPurchase;
use App\Models\Invoice;
use Illuminate\Console\Command;

class GenerateMissingInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:generate-missing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate missing invoices for completed purchases';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating missing invoices...');

        // Find all successful purchases without invoices
        $purchasesWithoutInvoices = ContactPurchase::with(['agent', 'property'])
            ->where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)
            ->whereDoesntHave('invoice')
            ->get();

        $this->info("Found {$purchasesWithoutInvoices->count()} purchases without invoices.");

        $generated = 0;
        $errors = 0;

        foreach ($purchasesWithoutInvoices as $purchase) {
            try {
                $invoice = $purchase->generateInvoice();
                if ($invoice) {
                    $this->info("Generated invoice {$invoice->invoice_number} for purchase {$purchase->id}");
                    $generated++;
                } else {
                    $this->warn("Could not generate invoice for purchase {$purchase->id}");
                }
            } catch (\Exception $e) {
                $this->error("Error generating invoice for purchase {$purchase->id}: " . $e->getMessage());
                $errors++;
            }
        }

        $this->info("Successfully generated {$generated} invoices.");
        if ($errors > 0) {
            $this->warn("Encountered {$errors} errors.");
        }

        return 0;
    }
}
