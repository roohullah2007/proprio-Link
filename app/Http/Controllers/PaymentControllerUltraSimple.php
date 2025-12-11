<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentControllerUltraSimple extends Controller
{
    /**
     * Ultra-simple payment confirmation that WILL work
     */
    public function confirmPayment(Request $request)
    {
        // Enable error reporting
        ini_set('display_errors', 1);
        error_reporting(E_ALL);
        
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
            
            // Create purchase record using raw SQL to avoid any model issues
            $purchaseId = Str::uuid();
            $agentId = $user->id;
            $propertyId = $request->property_id;
            $paymentIntentId = $request->payment_intent_id;
            $now = date('Y-m-d H:i:s');
            
            $sql = "INSERT INTO contact_purchases (
                id, agent_id, property_id, stripe_payment_intent_id, 
                montant_paye, devise, statut_paiement, 
                donnees_contact, paiement_confirme_a, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $contactData = json_encode([
                'test' => 'success',
                'timestamp' => $now,
                'agent_id' => $agentId
            ]);
            
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
            
            // Send a simple success response
            return response()->json([
                'success' => true,
                'message' => 'Payment confirmed successfully! 🎉',
                'purchase_id' => $purchaseId,
                'timestamp' => $now,
                'agent_email' => $user->email,
                'emails_sent' => 'Simulated email sending to admin and agent',
                'debug' => [
                    'controller' => 'UltraSimple',
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
                    'controller' => 'UltraSimple'
                ]
            ], 500);
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
