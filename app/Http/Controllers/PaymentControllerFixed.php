<?php

namespace App\Http\Controllers;

use App\Models\ContactPurchase;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentControllerFixed extends Controller
{
    private $stripe = null;

    public function __construct()
    {
        // Initialize Stripe with error handling
        try {
            $stripeSecret = $this->getStripeSecretKey();
            if ($stripeSecret) {
                $this->stripe = new StripeClient($stripeSecret);
            }
        } catch (\Exception $e) {
            Log::error('Stripe initialization failed: ' . $e->getMessage());
        }
    }

    /**
     * Get Stripe secret key with fallback
     */
    private function getStripeSecretKey()
    {
        try {
            // Try database first
            $encryptedKey = DB::table('admin_settings')
                ->where('key_name', 'stripe_secret_key')
                ->value('value');

            if ($encryptedKey) {
                return Crypt::decryptString($encryptedKey);
            }
        } catch (\Exception $e) {
            Log::warning('Database Stripe key not found, using env: ' . $e->getMessage());
        }

        // Fallback to environment
        return config('services.stripe.secret') ?? env('STRIPE_SECRET');
    }

    /**
     * Get Stripe settings with fallbacks
     */
    private function getStripeSettings()
    {
        try {
            $settings = DB::table('admin_settings')
                ->whereIn('key_name', [
                    'stripe_publishable_key', 
                    'stripe_secret_key', 
                    'contact_purchase_price', 
                    'payment_currency'
                ])
                ->pluck('value', 'key_name');

            return [
                'publishable_key' => $settings['stripe_publishable_key'] ?? config('services.stripe.key') ?? env('STRIPE_KEY'),
                'secret_key' => !empty($settings['stripe_secret_key']) 
                    ? Crypt::decryptString($settings['stripe_secret_key']) 
                    : (config('services.stripe.secret') ?? env('STRIPE_SECRET')),
                'contact_price' => (float)($settings['contact_purchase_price'] ?? 15.00),
                'currency' => strtolower($settings['payment_currency'] ?? 'eur'),
            ];
        } catch (\Exception $e) {
            Log::warning('Database settings not available, using fallbacks: ' . $e->getMessage());
            
            // Fallback to environment
            return [
                'publishable_key' => config('services.stripe.key') ?? env('STRIPE_KEY'),
                'secret_key' => config('services.stripe.secret') ?? env('STRIPE_SECRET'),
                'contact_price' => 15.00,
                'currency' => 'eur',
            ];
        }
    }

    /**
     * Confirm payment and create contact purchase record
     */
    public function confirmPayment(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'payment_intent_id' => 'required|string',
                'property_id' => 'required|string|exists:properties,id',
            ]);

            Log::info('Payment confirmation started', [
                'payment_intent_id' => $request->payment_intent_id,
                'property_id' => $request->property_id,
                'agent_id' => Auth::id(),
            ]);

            // Check if user is authenticated and is an agent
            $user = Auth::user();
            if (!$user || $user->type_utilisateur !== 'AGENT') {
                return response()->json(['error' => __('Accès non autorisé.')], 403);
            }

            // Get Stripe settings
            $stripeSettings = $this->getStripeSettings();
            
            if (empty($stripeSettings['secret_key'])) {
                Log::error('Stripe secret key not configured');
                return response()->json(['error' => __('Système de paiement non configuré.')], 500);
            }

            // Initialize Stripe client with current settings
            $stripe = new StripeClient($stripeSettings['secret_key']);

            // Retrieve payment intent from Stripe
            $paymentIntent = $stripe->paymentIntents->retrieve($request->payment_intent_id);

            Log::info('Payment intent retrieved', [
                'payment_intent_id' => $request->payment_intent_id,
                'status' => $paymentIntent->status,
                'amount' => $paymentIntent->amount,
            ]);

            // Verify payment was successful
            if ($paymentIntent->status !== 'succeeded') {
                Log::warning('Payment intent not succeeded', [
                    'payment_intent_id' => $request->payment_intent_id,
                    'status' => $paymentIntent->status,
                ]);
                return response()->json(['error' => __('Le paiement n\'a pas été confirmé.')], 400);
            }

            // Verify metadata matches request
            $metadata = $paymentIntent->metadata;
            if ($metadata['agent_id'] != Auth::id() || $metadata['property_id'] != $request->property_id) {
                Log::warning('Payment metadata mismatch', [
                    'expected_agent' => Auth::id(),
                    'actual_agent' => $metadata['agent_id'] ?? 'null',
                    'expected_property' => $request->property_id,
                    'actual_property' => $metadata['property_id'] ?? 'null',
                ]);
                return response()->json(['error' => __('Données de paiement invalides.')], 400);
            }

            // Check if contact purchase already exists
            $existingPurchase = ContactPurchase::where('stripe_payment_intent_id', $request->payment_intent_id)->first();
            if ($existingPurchase) {
                Log::info('Payment already processed', [
                    'payment_intent_id' => $request->payment_intent_id,
                    'existing_purchase_id' => $existingPurchase->id,
                ]);
                return response()->json(['error' => __('Ce paiement a déjà été traité.')], 400);
            }

            // Get property with owner
            $property = Property::with('proprietaire')->findOrFail($request->property_id);

            // Create contact purchase record
            $contactPurchase = ContactPurchase::create([
                'id' => Str::uuid(),
                'agent_id' => Auth::id(),
                'property_id' => $request->property_id,
                'stripe_payment_intent_id' => $request->payment_intent_id,
                'montant_paye' => $paymentIntent->amount / 100, // Convert from cents
                'devise' => $paymentIntent->currency,
                'statut_paiement' => ContactPurchase::STATUS_PENDING,
            ]);

            Log::info('Contact purchase created', [
                'purchase_id' => $contactPurchase->id,
                'amount' => $contactPurchase->montant_paye,
            ]);

            // Mark as succeeded and auto-generate invoice
            $contactData = [
                'nom' => $property->proprietaire->nom,
                'prenom' => $property->proprietaire->prenom,
                'email' => $property->proprietaire->email,
                'telephone' => $property->proprietaire->telephone,
            ];
            
            $contactPurchase->markPaymentSucceeded($contactData);

            // Send emails (with error handling)
            $this->sendPaymentSuccessEmails($contactPurchase, $property);

            // Update property contact count
            if ($property->contacts_restants > 0) {
                $property->decrement('contacts_restants');
            }

            Log::info('Contact purchase completed successfully', [
                'purchase_id' => $contactPurchase->id,
                'agent_id' => Auth::id(),
                'property_id' => $request->property_id,
                'amount' => $contactPurchase->montant_paye,
            ]);

            return response()->json([
                'success' => true,
                'message' => __('Paiement confirmé avec succès!'),
                'purchase_id' => $contactPurchase->id,
                'redirect_url' => route('payment.contact-details', $contactPurchase->id),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Payment validation failed', [
                'errors' => $e->errors(),
                'request' => $request->all(),
            ]);
            
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
            
        } catch (ApiErrorException $e) {
            Log::error('Stripe API error', [
                'error' => $e->getMessage(),
                'payment_intent_id' => $request->payment_intent_id ?? 'N/A',
                'agent_id' => Auth::id(),
            ]);

            return response()->json([
                'error' => __('Erreur lors de la confirmation du paiement.')
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('Payment confirmation failed with exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payment_intent_id' => $request->payment_intent_id ?? 'N/A',
                'agent_id' => Auth::id(),
                'request' => $request->all(),
            ]);

            // Send payment failed emails
            $this->sendPaymentFailedEmails($request, $e->getMessage());

            return response()->json([
                'error' => __('Erreur système. Veuillez contacter le support.'),
                'debug_message' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Send payment success emails
     */
    private function sendPaymentSuccessEmails($contactPurchase, $property)
    {
        try {
            // Send email to agent
            $agentLocale = $contactPurchase->agent->language ?? 'fr';
            \Mail::to($contactPurchase->agent)->send(
                new \App\Mail\PaymentSuccessEmail($contactPurchase, $agentLocale, false)
            );
            
            // Send notification to admins
            $admins = User::where('type_utilisateur', User::TYPE_ADMIN)->get();
            foreach ($admins as $admin) {
                $adminLocale = $admin->language ?? 'fr';
                \Mail::to($admin->email)->send(
                    new \App\Mail\PaymentSuccessEmail($contactPurchase, $adminLocale, true)
                );
            }
            
            // Send notification to property owner
            $ownerLocale = $property->proprietaire->language ?? 'fr';
            \Mail::to($property->proprietaire)->send(
                new \App\Mail\PropertyContactPurchased($contactPurchase, $ownerLocale)
            );
            
            Log::info('Payment success emails sent', [
                'purchase_id' => $contactPurchase->id,
                'agent_email' => $contactPurchase->agent->email,
                'admin_count' => $admins->count(),
                'owner_email' => $property->proprietaire->email,
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send payment success emails: ' . $e->getMessage());
        }
    }

    /**
     * Send payment failed emails
     */
    private function sendPaymentFailedEmails(Request $request, $errorMessage = null)
    {
        try {
            $agent = Auth::user();
            $property = null;
            
            if ($request->has('property_id')) {
                $property = Property::find($request->property_id);
            }
            
            $mockPurchase = new \stdClass();
            $mockPurchase->id = 'FAILED-' . time();
            $mockPurchase->agent = $agent;
            $mockPurchase->property = $property;
            $mockPurchase->created_at = now();
            
            // Send email to agent
            $agentLocale = $agent->language ?? 'fr';
            \Mail::to($agent->email)->send(
                new \App\Mail\PaymentFailedEmail($mockPurchase, $agentLocale, false, $errorMessage)
            );
            
            // Send notification to admins
            $admins = User::where('type_utilisateur', User::TYPE_ADMIN)->get();
            foreach ($admins as $admin) {
                $adminLocale = $admin->language ?? 'fr';
                \Mail::to($admin->email)->send(
                    new \App\Mail\PaymentFailedEmail($mockPurchase, $adminLocale, true, $errorMessage)
                );
            }
            
            Log::info('Payment failed emails sent', [
                'agent_email' => $agent->email,
                'admin_count' => $admins->count(),
                'error_message' => $errorMessage
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to send payment failed emails: ' . $e->getMessage());
        }
    }
}
