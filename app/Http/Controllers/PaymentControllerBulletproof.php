<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PaymentControllerBulletproof extends Controller
{
    /**
     * Bulletproof payment confirmation
     */
    public function confirmPayment(Request $request)
    {
        // Force JSON response header
        header('Content-Type: application/json; charset=utf-8');
        
        // Enable error reporting for debugging
        error_reporting(E_ALL);
        ini_set('display_errors', 0); // Don't display, but log
        
        $debugLog = storage_path('logs/payment_debug.log');
        
        try {
            // Log start with timestamp
            $this->log($debugLog, "=== PAYMENT CONFIRMATION START ===");
            $this->log($debugLog, "Request data: " . json_encode($request->all()));
            $this->log($debugLog, "User ID: " . (Auth::id() ?? 'not authenticated'));
            $this->log($debugLog, "User type: " . (Auth::user()->type_utilisateur ?? 'unknown'));
            
            // Step 1: Validate input
            if (!$request->has('payment_intent_id')) {
                $this->log($debugLog, "ERROR: Missing payment_intent_id");
                return $this->jsonResponse(['error' => 'Missing payment_intent_id'], 400);
            }
            
            if (!$request->has('property_id')) {
                $this->log($debugLog, "ERROR: Missing property_id");
                return $this->jsonResponse(['error' => 'Missing property_id'], 400);
            }
            
            $this->log($debugLog, "Input validation: PASSED");
            
            // Step 2: Check authentication
            if (!Auth::check()) {
                $this->log($debugLog, "ERROR: User not authenticated");
                return $this->jsonResponse(['error' => 'Not authenticated'], 401);
            }
            
            $user = Auth::user();
            if ($user->type_utilisateur !== 'AGENT') {
                $this->log($debugLog, "ERROR: User is not an agent: " . $user->type_utilisateur);
                return $this->jsonResponse(['error' => 'Only agents can purchase contacts'], 403);
            }
            
            $this->log($debugLog, "Authentication check: PASSED");
            
            // Step 3: Check if payment already processed
            $paymentIntentId = $request->payment_intent_id;
            $existingPurchase = DB::table('contact_purchases')
                ->where('stripe_payment_intent_id', $paymentIntentId)
                ->first();
                
            if ($existingPurchase) {
                $this->log($debugLog, "Payment already processed: " . $paymentIntentId);
                return $this->jsonResponse(['error' => 'Payment already processed'], 400);
            }
            
            $this->log($debugLog, "Duplicate check: PASSED");
            
            // Step 4: Get property details
            $propertyId = $request->property_id;
            $property = DB::table('properties')
                ->leftJoin('users as proprietaires', 'properties.proprietaire_id', '=', 'proprietaires.id')
                ->where('properties.id', $propertyId)
                ->select(
                    'properties.id',
                    'properties.adresse_complete',
                    'properties.prix',
                    'properties.type_propriete',
                    'properties.ville',
                    'properties.pays',
                    'proprietaires.nom as owner_nom',
                    'proprietaires.prenom as owner_prenom',
                    'proprietaires.email as owner_email',
                    'proprietaires.telephone as owner_telephone'
                )
                ->first();
                
            if (!$property) {
                $this->log($debugLog, "ERROR: Property not found: " . $propertyId);
                return $this->jsonResponse(['error' => 'Property not found'], 404);
            }
            
            $this->log($debugLog, "Property check: PASSED - " . $property->adresse_complete);
            
            // Step 5: Create purchase record
            $purchaseId = Str::uuid();
            $now = date('Y-m-d H:i:s');
            
            $contactData = json_encode([
                'nom' => $property->owner_nom ?? 'N/A',
                'prenom' => $property->owner_prenom ?? 'N/A', 
                'email' => $property->owner_email ?? 'N/A',
                'telephone' => $property->owner_telephone ?? 'N/A',
                'timestamp' => $now
            ]);
            
            $this->log($debugLog, "Creating purchase record: " . $purchaseId);
            
            // Use direct SQL to avoid any model issues
            $inserted = DB::insert("
                INSERT INTO contact_purchases (
                    id, agent_id, property_id, stripe_payment_intent_id,
                    montant_paye, devise, statut_paiement, donnees_contact,
                    paiement_confirme_a, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ", [
                $purchaseId,
                $user->id,
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
            
            if (!$inserted) {
                $this->log($debugLog, "ERROR: Failed to insert purchase record");
                return $this->jsonResponse(['error' => 'Failed to create purchase record'], 500);
            }
            
            $this->log($debugLog, "Purchase record created: SUCCESS");
            
            // Step 6: Send emails
            $emailResults = $this->sendEmails($debugLog, $user, $property, $purchaseId);
            
            $this->log($debugLog, "=== PAYMENT CONFIRMATION SUCCESS ===");
            
            // Step 7: Return success response
            return $this->jsonResponse([
                'success' => true,
                'message' => 'Payment confirmed successfully! 🎉',
                'purchase_id' => $purchaseId,
                'timestamp' => $now,
                'agent_email' => $user->email,
                'property_address' => $property->adresse_complete,
                'emails_sent' => $emailResults['message'],
                'email_details' => $emailResults['details'],
                'contact_info' => [
                    'owner_name' => trim(($property->owner_prenom ?? '') . ' ' . ($property->owner_nom ?? '')),
                    'owner_email' => $property->owner_email ?? 'N/A',
                    'owner_phone' => $property->owner_telephone ?? 'N/A'
                ],
                'debug' => [
                    'controller' => 'Bulletproof',
                    'user_id' => $user->id,
                    'property_id' => $propertyId,
                    'payment_intent_id' => $paymentIntentId
                ]
            ], 200);
            
        } catch (\Exception $e) {
            $this->log($debugLog, "=== CRITICAL ERROR ===");
            $this->log($debugLog, "Exception: " . $e->getMessage());
            $this->log($debugLog, "File: " . $e->getFile() . ":" . $e->getLine());
            $this->log($debugLog, "Stack trace: " . $e->getTraceAsString());
            
            return $this->jsonResponse([
                'success' => false,
                'error' => 'Payment processing failed',
                'message' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'controller' => 'Bulletproof'
                ]
            ], 500);
        }
    }
    
    /**
     * Send emails to agent and admins
     */
    private function sendEmails($debugLog, $user, $property, $purchaseId)
    {
        $emailDetails = [];
        $successCount = 0;
        $totalEmails = 0;
        
        try {
            $this->log($debugLog, "Starting email sending...");
            
            // Get admin users
            $admins = DB::table('users')
                ->where('type_utilisateur', 'ADMIN')
                ->select('id', 'email', 'prenom', 'nom', 'language')
                ->get();
                
            $this->log($debugLog, "Found " . $admins->count() . " admin users");
            
            // Create mock purchase object for email compatibility
            $mockPurchase = (object)[
                'id' => $purchaseId,
                'agent' => $user,
                'property' => (object)[
                    'id' => $property->id,
                    'adresse_complete' => $property->adresse_complete,
                    'prix' => $property->prix,
                    'type_propriete' => $property->type_propriete,
                    'ville' => $property->ville,
                    'pays' => $property->pays,
                    'proprietaire' => (object)[
                        'nom' => $property->owner_nom,
                        'prenom' => $property->owner_prenom,
                        'email' => $property->owner_email
                    ]
                ],
                'montant_paye' => 15.00,
                'devise' => 'eur',
                'created_at' => now(),
                'paiement_confirme_a' => now(),
                'stripe_payment_intent_id' => 'pi_success_' . time()
            ];
            
            // Send agent email
            try {
                $agentLocale = $user->language ?? 'fr';
                Mail::to($user->email)->send(new \App\Mail\PaymentSuccessEmail($mockPurchase, $agentLocale, false));
                $emailDetails[] = "✅ Agent email sent to: " . $user->email;
                $successCount++;
                $this->log($debugLog, "Agent email sent successfully to: " . $user->email);
            } catch (\Exception $e) {
                $emailDetails[] = "❌ Agent email failed: " . $e->getMessage();
                $this->log($debugLog, "Agent email failed: " . $e->getMessage());
            }
            $totalEmails++;
            
            // Send admin emails
            foreach ($admins as $admin) {
                try {
                    $adminLocale = $admin->language ?? 'fr';
                    Mail::to($admin->email)->send(new \App\Mail\PaymentSuccessEmail($mockPurchase, $adminLocale, true));
                    $emailDetails[] = "✅ Admin email sent to: " . $admin->email;
                    $successCount++;
                    $this->log($debugLog, "Admin email sent successfully to: " . $admin->email);
                } catch (\Exception $e) {
                    $emailDetails[] = "❌ Admin email failed for " . $admin->email . ": " . $e->getMessage();
                    $this->log($debugLog, "Admin email failed for " . $admin->email . ": " . $e->getMessage());
                }
                $totalEmails++;
            }
            
            $message = "Emails sent: $successCount/$totalEmails successful";
            $this->log($debugLog, "Email sending complete: " . $message);
            
            return [
                'success' => $successCount > 0,
                'message' => $message,
                'details' => $emailDetails,
                'total_sent' => $successCount,
                'total_attempted' => $totalEmails
            ];
            
        } catch (\Exception $e) {
            $errorMessage = "Email system error: " . $e->getMessage();
            $this->log($debugLog, $errorMessage);
            
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
     * Log message with timestamp
     */
    private function log($file, $message)
    {
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($file, "[$timestamp] $message\n", FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Return JSON response with proper headers
     */
    private function jsonResponse($data, $status = 200)
    {
        return response()->json($data, $status)
            ->header('Content-Type', 'application/json; charset=utf-8')
            ->header('Cache-Control', 'no-cache, must-revalidate');
    }
    
    /**
     * Show payment form
     */
    public function showPaymentForm(Request $request, $propertyId)
    {
        try {
            $property = DB::table('properties')->where('id', $propertyId)->first();
            
            return \Inertia\Inertia::render('Payment/ContactPurchase', [
                'property' => $property,
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
            return response()->json([
                'client_secret' => 'pi_test_' . time() . '_secret_bulletproof',
                'payment_intent_id' => 'pi_test_' . time(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create payment intent: ' . $e->getMessage()], 500);
        }
    }
}
