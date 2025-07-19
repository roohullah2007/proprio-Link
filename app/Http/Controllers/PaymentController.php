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

class PaymentController extends Controller
{
    private StripeClient $stripe;

    public function __construct()
    {
        // Initialize Stripe with database settings
        $stripeSecret = $this->getStripeSecretKey();
        if ($stripeSecret) {
            $this->stripe = new StripeClient($stripeSecret);
        }
    }

    /**
     * Get Stripe settings from database
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
                'publishable_key' => $settings['stripe_publishable_key'] ?? '',
                'secret_key' => !empty($settings['stripe_secret_key']) 
                    ? Crypt::decryptString($settings['stripe_secret_key']) 
                    : '',
                'contact_price' => (float)($settings['contact_purchase_price'] ?? 15.00),
                'currency' => strtolower($settings['payment_currency'] ?? 'eur'),
            ];
        } catch (\Exception $e) {
            // Fallback to config values
            return [
                'publishable_key' => config('services.stripe.key', ''),
                'secret_key' => config('services.stripe.secret', ''),
                'contact_price' => config('services.stripe.contact_price', 15.00),
                'currency' => config('services.stripe.currency', 'eur'),
            ];
        }
    }

    /**
     * Get Stripe secret key from database
     */
    private function getStripeSecretKey()
    {
        try {
            $encryptedKey = DB::table('admin_settings')
                ->where('key_name', 'stripe_secret_key')
                ->value('value');

            if ($encryptedKey) {
                return Crypt::decryptString($encryptedKey);
            }
        } catch (\Exception $e) {
            // Fallback to config
            return config('services.stripe.secret');
        }

        return config('services.stripe.secret');
    }

    /**
     * Show the payment form for purchasing property contact info
     */
    public function showPaymentForm(Request $request, Property $property)
    {
        // Ensure user is an agent
        if (Auth::user()->type_utilisateur !== 'AGENT') {
            return redirect()->route('dashboard')->with('error', __('Seuls les agents peuvent acheter des contacts.'));
        }

        // Check if property is published
        if ($property->statut !== 'PUBLIE') {
            return redirect()->route('agent.properties')->with('error', __('Cette propriété n\'est pas disponible.'));
        }

        // Check if agent already purchased this contact
        $existingPurchase = ContactPurchase::where('agent_id', Auth::id())
            ->where('property_id', $property->id)
            ->first();

        if ($existingPurchase) {
            return redirect()->route('agent.purchases')->with('info', __('Vous avez déjà acheté ce contact.'));
        }

        // Get Stripe settings from database
        $stripeSettings = $this->getStripeSettings();

        return Inertia::render('Payment/ContactPurchase', [
            'property' => $property->load(['images', 'proprietaire']),
            'price' => $stripeSettings['contact_price'],
            'currency' => $stripeSettings['currency'],
            'stripePublishableKey' => $stripeSettings['publishable_key'],
        ]);
    }

    /**
     * Create payment intent for contact purchase
     */
    public function createPaymentIntent(Request $request, Property $property)
    {
        try {
            // Validate that user is an agent
            if (Auth::user()->type_utilisateur !== 'AGENT') {
                return response()->json(['error' => __('Accès non autorisé.')], 403);
            }

            // Check if property is available
            if ($property->statut !== 'PUBLIE') {
                return response()->json(['error' => __('Propriété non disponible.')], 400);
            }

            // Check if already purchased
            $existingPurchase = ContactPurchase::where('agent_id', Auth::id())
                ->where('property_id', $property->id)
                ->first();

            if ($existingPurchase) {
                return response()->json(['error' => __('Contact déjà acheté.')], 400);
            }

            // Get Stripe settings from database
            $stripeSettings = $this->getStripeSettings();
            
            // Check if Stripe is configured
            if (empty($stripeSettings['secret_key'])) {
                return response()->json(['error' => __('Payment system not configured.')], 500);
            }

            // Reinitialize Stripe client with current settings (in case they were updated)
            $this->stripe = new StripeClient($stripeSettings['secret_key']);

            // Create payment intent
            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => (int)($stripeSettings['contact_price'] * 100), // Convert to cents
                'currency' => $stripeSettings['currency'],
                'metadata' => [
                    'agent_id' => Auth::id(),
                    'property_id' => $property->id,
                    'agent_email' => Auth::user()->email,
                    'property_address' => $property->adresse_complete,
                ],
                'description' => "Contact purchase for property: {$property->adresse_complete}",
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
            ]);

        } catch (ApiErrorException $e) {
            Log::error('Stripe payment intent creation failed', [
                'error' => $e->getMessage(),
                'agent_id' => Auth::id(),
                'property_id' => $property->id,
            ]);

            return response()->json([
                'error' => __('Error creating payment. Please try again.')
            ], 500);
        } catch (\Exception $e) {
            Log::error('Payment intent creation failed with exception', [
                'error' => $e->getMessage(),
                'agent_id' => Auth::id(),
                'property_id' => $property->id,
            ]);

            return response()->json([
                'error' => __('Payment system error. Please contact support.')
            ], 500);
        }
    }

    /**
     * Confirm payment and create contact purchase record
     */
    public function confirmPayment(Request $request)
    {
        try {
            $request->validate([
                'payment_intent_id' => 'required|string',
                'property_id' => 'required|uuid|exists:properties,id',
            ]);

            // Get Stripe settings and reinitialize client if needed
            $stripeSettings = $this->getStripeSettings();
            if (empty($stripeSettings['secret_key'])) {
                return response()->json(['error' => __('Payment system not configured.')], 500);
            }

            // Reinitialize Stripe client
            $this->stripe = new StripeClient($stripeSettings['secret_key']);

            // Retrieve payment intent from Stripe
            $paymentIntent = $this->stripe->paymentIntents->retrieve($request->payment_intent_id);

            // Verify payment was successful
            if ($paymentIntent->status !== 'succeeded') {
                return response()->json(['error' => __('Le paiement n\'a pas été confirmé.')], 400);
            }

            // Verify metadata matches request
            $metadata = $paymentIntent->metadata;
            if ($metadata['agent_id'] != Auth::id() || $metadata['property_id'] != $request->property_id) {
                return response()->json(['error' => __('Données de paiement invalides.')], 400);
            }

            // Check if contact purchase already exists
            $existingPurchase = ContactPurchase::where('stripe_payment_intent_id', $request->payment_intent_id)->first();
            if ($existingPurchase) {
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
                'statut_paiement' => ContactPurchase::STATUS_PENDING, // Start as pending
            ]);

            // Mark as succeeded and auto-generate invoice
            $contactData = [
                'nom' => $property->proprietaire->nom,
                'prenom' => $property->proprietaire->prenom,
                'email' => $property->proprietaire->email,
                'telephone' => $property->proprietaire->telephone,
            ];
            
            $contactPurchase->markPaymentSucceeded($contactData);

            // Send purchase confirmation email with invoice
            try {
                // Temporarily disabled email sending for debugging
                // \Mail::to($contactPurchase->agent)->send(new \App\Mail\AgentPurchaseConfirmation($contactPurchase, $contactData));
                \Log::info('Purchase confirmation email would be sent to: ' . $contactPurchase->agent->email);
            } catch (\Exception $e) {
                \Log::error('Failed to send purchase confirmation email: ' . $e->getMessage());
            }

            // Send notification to property owner
            try {
                // Temporarily disabled email sending for debugging
                // \Mail::to($property->proprietaire)->send(new \App\Mail\PropertyContactPurchased($contactPurchase));
                \Log::info('Property owner notification email would be sent to: ' . $property->proprietaire->email);
            } catch (\Exception $e) {
                \Log::error('Failed to send property owner notification email: ' . $e->getMessage());
            }

            // Update property contact count
            if ($property->contacts_restants > 0) {
                $property->decrement('contacts_restants');
            }

            Log::info('Contact purchase completed', [
                'purchase_id' => $contactPurchase->id,
                'agent_id' => Auth::id(),
                'property_id' => $request->property_id,
                'amount' => $contactPurchase->montant_paye,
            ]);

            return response()->json([
                'success' => true,
                'message' => __('Paiement confirmé avec succès!'),
                'purchase_id' => $contactPurchase->id,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (ApiErrorException $e) {
            Log::error('Stripe payment confirmation failed', [
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
            ]);

            return response()->json([
                'error' => __('Erreur système. Veuillez contacter le support.')
            ], 500);
        }
    }

    /**
     * Show agent's purchase history
     */
    public function purchaseHistory()
    {
        $purchases = ContactPurchase::with(['property.images', 'property.proprietaire'])
            ->where('agent_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Agent/PurchaseHistory', [
            'purchases' => $purchases,
        ]);
    }

    /**
     * Show contact details for purchased property
     */
    public function showContactDetails(ContactPurchase $purchase)
    {
        // Verify the purchase belongs to the authenticated agent
        if ($purchase->agent_id !== Auth::id()) {
            return redirect()->route('agent.purchases')->with('error', __('Accès non autorisé.'));
        }

        $property = $purchase->property->load(['images', 'proprietaire']);

        return Inertia::render('Agent/ContactDetails', [
            'purchase' => $purchase,
            'property' => $property,
            'owner' => $property->proprietaire,
        ]);
    }
}
