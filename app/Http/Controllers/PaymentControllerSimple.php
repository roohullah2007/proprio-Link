<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentControllerSimple extends Controller
{
    /**
     * Simple payment confirmation for testing
     */
    public function confirmPayment(Request $request)
    {
        // Log everything for debugging
        Log::info('=== PAYMENT CONFIRMATION START ===');
        Log::info('Request data: ', $request->all());
        Log::info('User: ', ['id' => Auth::id(), 'type' => Auth::user()->type_utilisateur ?? 'unknown']);

        try {
            // Step 1: Basic validation
            if (!$request->has('payment_intent_id') || !$request->has('property_id')) {
                Log::error('Missing required fields');
                return response()->json(['error' => 'Missing payment_intent_id or property_id'], 400);
            }

            // Step 2: Check authentication
            if (!Auth::check()) {
                Log::error('User not authenticated');
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            if (Auth::user()->type_utilisateur !== 'AGENT') {
                Log::error('User is not an agent');
                return response()->json(['error' => 'Only agents can purchase contacts'], 403);
            }

            // Step 3: Check if property exists
            $property = DB::table('properties')->where('id', $request->property_id)->first();
            if (!$property) {
                Log::error('Property not found', ['property_id' => $request->property_id]);
                return response()->json(['error' => 'Property not found'], 404);
            }

            // Step 4: Check if payment already processed
            $existing = DB::table('contact_purchases')
                ->where('stripe_payment_intent_id', $request->payment_intent_id)
                ->first();
                
            if ($existing) {
                Log::info('Payment already processed');
                return response()->json(['error' => 'Payment already processed'], 400);
            }

            // Step 5: Create purchase record
            $purchaseId = Str::uuid();
            
            Log::info('Creating contact purchase...');
            
            DB::table('contact_purchases')->insert([
                'id' => $purchaseId,
                'agent_id' => Auth::id(),
                'property_id' => $request->property_id,
                'stripe_payment_intent_id' => $request->payment_intent_id,
                'montant_paye' => 15.00,
                'devise' => 'eur',
                'statut_paiement' => 'succeeded',
                'donnees_contact' => json_encode([
                    'test' => 'data',
                    'created_by' => 'simple_controller'
                ]),
                'paiement_confirme_a' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Log::info('Contact purchase created successfully', ['purchase_id' => $purchaseId]);

            // Step 6: Simple success response
            Log::info('=== PAYMENT CONFIRMATION SUCCESS ===');
            
            return response()->json([
                'success' => true,
                'message' => 'Payment confirmed successfully!',
                'purchase_id' => $purchaseId,
                'debug_info' => [
                    'controller' => 'Simple',
                    'timestamp' => now()->toISOString(),
                    'agent_id' => Auth::id(),
                    'property_id' => $request->property_id,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('=== PAYMENT CONFIRMATION ERROR ===');
            Log::error('Exception: ' . $e->getMessage());
            Log::error('File: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'error' => 'Payment processing failed',
                'debug_message' => $e->getMessage(),
                'debug_file' => $e->getFile(),
                'debug_line' => $e->getLine(),
            ], 500);
        }
    }

    /**
     * Show payment form
     */
    public function showPaymentForm(Request $request, $propertyId)
    {
        try {
            $property = DB::table('properties')->where('id', $propertyId)->first();
            
            if (!$property) {
                return redirect()->back()->with('error', 'Property not found');
            }

            return \Inertia\Inertia::render('Payment/ContactPurchase', [
                'property' => $property,
                'price' => 15.00,
                'currency' => 'eur',
                'stripePublishableKey' => env('STRIPE_KEY', 'pk_test_default'),
            ]);

        } catch (\Exception $e) {
            Log::error('Payment form error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading payment form');
        }
    }

    /**
     * Create payment intent
     */
    public function createPaymentIntent(Request $request, $propertyId)
    {
        try {
            Log::info('Creating payment intent', ['property_id' => $propertyId]);

            // Return mock payment intent for testing
            return response()->json([
                'client_secret' => 'pi_test_' . time() . '_secret_test',
                'payment_intent_id' => 'pi_test_' . time(),
            ]);

        } catch (\Exception $e) {
            Log::error('Payment intent creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create payment intent'], 500);
        }
    }
}
