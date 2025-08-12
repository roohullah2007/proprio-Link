<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Mail\PaymentSuccessEmail;

class PaymentControllerWithEmails extends Controller
{
    /**
     * Payment confirmation with email sending
     */
    public function confirmPayment(Request $request)
    {
        // Set JSON header immediately
        header('Content-Type: application/json');
        
        try {
            // Log start
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] Payment confirmation started\n", 
                FILE_APPEND | LOCK_EX
            );
            
            // Basic input validation
            if (!$request->has('payment_intent_id')) {
                return response()->json(['error' => 'Missing payment_intent_id'], 400);
            }
            
            if (!$request->has('property_id')) {
                return response()->json(['error' => 'Missing property_id'], 400);
            }
            
            // Check authentication
            if (!Auth::check()) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }
            
            $user = Auth::user();
            if ($user->type_utilisateur !== 'AGENT') {
                return response()->json(['error' => 'Only agents can purchase contacts'], 403);
            }
            
            // Log progress
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] User validation passed\n", 
                FILE_APPEND | LOCK_EX
            );
            
            // Create purchase record using raw SQL
            $purchaseId = Str::uuid();
            $agentId = $user->id;
            $propertyId = $request->property_id;
            $paymentIntentId = $request->payment_intent_id;
            $now = date('Y-m-d H:i:s');
            
            // Get property details for email
            $property = DB::table('properties')
                ->leftJoin('users as proprietaires', 'properties.proprietaire_id', '=', 'proprietaires.id')
                ->where('properties.id', $propertyId)
                ->select(
                    'properties.*',
                    'proprietaires.nom as owner_nom',
                    'proprietaires.prenom as owner_prenom',
                    'proprietaires.email as owner_email',
                    'proprietaires.telephone as owner_telephone'
                )
                ->first();
            
            $contactData = json_encode([
                'nom' => $property->owner_nom ?? 'N/A',
                'prenom' => $property->owner_prenom ?? 'N/A',
                'email' => $property->owner_email ?? 'N/A',
                'telephone' => $property->owner_telephone ?? 'N/A',
                'timestamp' => $now,
                'agent_id' => $agentId
            ]);
            
            $sql = "INSERT INTO contact_purchases (
                id, agent_id, property_id, stripe_payment_intent_id, 
                montant_paye, devise, statut_paiement, 
                donnees_contact, paiement_confirme_a, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            DB::insert($sql, [
                $purchaseId,
                $agentId, 
                $propertyId,
                $paymentIntentId,
                15.00,
                'eur',
                'succeeded',
                $contactData,
                $now,
                $now,
                $now
            ]);
            
            // Log success
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] Purchase record created: $purchaseId\n", 
                FILE_APPEND | LOCK_EX
            );
            
            // Send emails to agent and admins
            $emailResults = $this->sendPaymentSuccessEmails($purchaseId, $user, $property);
            
            // Send success response with email details
            return response()->json([
                'success' => true,
                'message' => 'Payment confirmed successfully! 🎉',
                'purchase_id' => $purchaseId,
                'timestamp' => $now,
                'agent_email' => $user->email,
                'property_address' => $property->adresse_complete ?? 'Unknown',
                'emails_sent' => $emailResults['message'],
                'email_details' => $emailResults['details'],
                'contact_info' => [
                    'owner_name' => ($property->owner_prenom ?? '') . ' ' . ($property->owner_nom ?? ''),
                    'owner_email' => $property->owner_email ?? 'N/A',
                    'owner_phone' => $property->owner_telephone ?? 'N/A'
                ],
                'debug' => [
                    'controller' => 'WithEmails',
                    'method' => 'confirmPayment',
                    'user_id' => $agentId,
                    'property_id' => $propertyId,
                    'payment_intent_id' => $paymentIntentId
                ]
            ], 200);
            
        } catch (\Exception $e) {
            // Log error with full details
            $errorLog = "[" . date('Y-m-d H:i:s') . "] ERROR: " . $e->getMessage() . "\n";
            $errorLog .= "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
            $errorLog .= "Trace: " . $e->getTraceAsString() . "\n\n";
            
            file_put_contents(storage_path('logs/payment_debug.log'), $errorLog, FILE_APPEND | LOCK_EX);
            
            // Return proper JSON error
            return response()->json([
                'success' => false,
                'error' => 'Payment processing failed',
                'message' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'controller' => 'WithEmails'
                ]
            ], 500);
        }
    }
    
    /**
     * Send payment success emails to agent and admins
     */
    private function sendPaymentSuccessEmails($purchaseId, $agent, $property)
    {
        $emailDetails = [];
        $successCount = 0;
        $totalEmails = 0;
        
        try {
            // Create a mock purchase object for email compatibility
            $mockPurchase = (object)[
                'id' => $purchaseId,
                'agent' => $agent,
                'property' => (object)[
                    'id' => $property->id ?? 'unknown',
                    'adresse_complete' => $property->adresse_complete ?? 'Unknown Address',
                    'prix' => $property->prix ?? 0,
                    'type_propriete' => $property->type_propriete ?? 'Unknown',
                    'proprietaire' => (object)[
                        'nom' => $property->owner_nom ?? 'Unknown',
                        'prenom' => $property->owner_prenom ?? 'Unknown',
                        'email' => $property->owner_email ?? 'unknown@example.com'
                    ]
                ],
                'montant_paye' => 15.00,
                'devise' => 'eur',
                'created_at' => now(),
                'stripe_payment_intent_id' => 'pi_success_' . time()
            ];
            
            // Log email sending start
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] Starting email sending\n", 
                FILE_APPEND | LOCK_EX
            );
            
            // 1. Send email to agent
            try {
                $agentLocale = $agent->language ?? 'fr';
                Mail::to($agent->email)->send(new PaymentSuccessEmail($mockPurchase, $agentLocale, false));
                $emailDetails[] = "✅ Agent email sent to: " . $agent->email;
                $successCount++;
                $totalEmails++;
                
                file_put_contents(storage_path('logs/payment_debug.log'), 
                    "[" . date('Y-m-d H:i:s') . "] Agent email sent to: " . $agent->email . "\n", 
                    FILE_APPEND | LOCK_EX
                );
            } catch (\Exception $e) {
                $emailDetails[] = "❌ Agent email failed: " . $e->getMessage();
                $totalEmails++;
                
                file_put_contents(storage_path('logs/payment_debug.log'), 
                    "[" . date('Y-m-d H:i:s') . "] Agent email failed: " . $e->getMessage() . "\n", 
                    FILE_APPEND | LOCK_EX
                );
            }
            
            // 2. Send emails to all admins
            $admins = User::where('type_utilisateur', 'ADMIN')->get();
            
            if ($admins->isEmpty()) {
                $emailDetails[] = "⚠️ No admin users found for notifications";
                file_put_contents(storage_path('logs/payment_debug.log'), 
                    "[" . date('Y-m-d H:i:s') . "] No admin users found\n", 
                    FILE_APPEND | LOCK_EX
                );
            } else {
                foreach ($admins as $admin) {
                    try {
                        $adminLocale = $admin->language ?? 'fr';
                        Mail::to($admin->email)->send(new PaymentSuccessEmail($mockPurchase, $adminLocale, true));
                        $emailDetails[] = "✅ Admin email sent to: " . $admin->email;
                        $successCount++;
                        $totalEmails++;
                        
                        file_put_contents(storage_path('logs/payment_debug.log'), 
                            "[" . date('Y-m-d H:i:s') . "] Admin email sent to: " . $admin->email . "\n", 
                            FILE_APPEND | LOCK_EX
                        );
                    } catch (\Exception $e) {
                        $emailDetails[] = "❌ Admin email failed for " . $admin->email . ": " . $e->getMessage();
                        $totalEmails++;
                        
                        file_put_contents(storage_path('logs/payment_debug.log'), 
                            "[" . date('Y-m-d H:i:s') . "] Admin email failed for " . $admin->email . ": " . $e->getMessage() . "\n", 
                            FILE_APPEND | LOCK_EX
                        );
                    }
                }
            }
            
            $message = "Emails sent: $successCount/$totalEmails successful";
            
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] Email sending complete: $message\n", 
                FILE_APPEND | LOCK_EX
            );
            
            return [
                'success' => true,
                'message' => $message,
                'details' => $emailDetails,
                'total_sent' => $successCount,
                'total_attempted' => $totalEmails
            ];
            
        } catch (\Exception $e) {
            $errorMessage = "Email system error: " . $e->getMessage();
            
            file_put_contents(storage_path('logs/payment_debug.log'), 
                "[" . date('Y-m-d H:i:s') . "] Email system error: " . $e->getMessage() . "\n", 
                FILE_APPEND | LOCK_EX
            );
            
            return [
                'success' => false,
                'message' => $errorMessage,
                'details' => [$errorMessage],
                'total_sent' => 0,
                'total_attempted' => 0
            ];
        }
    }
    
    /**
     * Show payment form
     */
    public function showPaymentForm(Request $request, $propertyId)
    {
        try {
            return \Inertia\Inertia::render('Payment/ContactPurchase', [
                'property' => (object)[
                    'id' => $propertyId,
                    'adresse_complete' => 'Test Property Address',
                    'prix' => 250000,
                    'type_propriete' => 'Apartment'
                ],
                'price' => 15.00,
                'currency' => 'eur',
                'stripePublishableKey' => env('STRIPE_KEY', 'pk_test_default'),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error loading payment form: ' . $e->getMessage());
        }
    }
    
    /**
     * Create payment intent
     */
    public function createPaymentIntent(Request $request, $propertyId)
    {
        try {
            // Return mock payment intent for testing
            return response()->json([
                'client_secret' => 'pi_test_' . time() . '_secret_mock',
                'payment_intent_id' => 'pi_test_' . time(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create payment intent: ' . $e->getMessage()], 500);
        }
    }
}
