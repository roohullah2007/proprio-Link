<?php
// PAYMENT CONTROLLER FIX - IMPROVED CONFIRM PAYMENT METHOD
// This file contains the fixed confirmPayment method to resolve the 500 error

/**
 * Confirm payment and create contact purchase record - FIXED VERSION
 */
public function confirmPayment(Request $request)
{
    // Enhanced logging for debugging
    $this->logPaymentDebug('Payment confirmation started', [
        'request_data' => $request->all(),
        'user_id' => Auth::id(),
        'user_type' => Auth::user()->type_utilisateur ?? 'unknown'
    ]);

    try {
        // Validate request with better error messages
        $validated = $request->validate([
            'payment_intent_id' => 'required|string|min:10',
            'property_id' => 'required|uuid|exists:properties,id',
        ]);

        $this->logPaymentDebug('Request validation passed', $validated);

        // Check user authorization
        if (!Auth::check() || Auth::user()->type_utilisateur !== 'AGENT') {
            $this->logPaymentDebug('User authorization failed', [
                'authenticated' => Auth::check(),
                'user_type' => Auth::user()->type_utilisateur ?? 'none'
            ]);
            return response()->json(['error' => __('Accès non autorisé.')], 403);
        }

        // Get and validate Stripe settings
        $stripeSettings = $this->getStripeSettings();
        if (empty($stripeSettings['secret_key'])) {
            $this->logPaymentDebug('Stripe configuration missing');
            return response()->json(['error' => __('Payment system not configured.')], 500);
        }

        // Reinitialize Stripe client with current settings
        try {
            $this->stripe = new StripeClient($stripeSettings['secret_key']);
            $this->logPaymentDebug('Stripe client initialized successfully');
        } catch (\Exception $e) {
            $this->logPaymentDebug('Stripe client initialization failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => __('Payment system configuration error.')], 500);
        }

        // Retrieve and validate payment intent from Stripe
        try {
            $paymentIntent = $this->stripe->paymentIntents->retrieve($validated['payment_intent_id']);
            $this->logPaymentDebug('Payment intent retrieved', [
                'payment_intent_id' => $paymentIntent->id,
                'status' => $paymentIntent->status,
                'amount' => $paymentIntent->amount
            ]);
        } catch (ApiErrorException $e) {
            $this->logPaymentDebug('Stripe API error retrieving payment intent', [
                'error' => $e->getMessage(),
                'payment_intent_id' => $validated['payment_intent_id']
            ]);
            return response()->json(['error' => __('Erreur lors de la vérification du paiement.')], 400);
        }

        // Verify payment was successful
        if ($paymentIntent->status !== 'succeeded') {
            $this->logPaymentDebug('Payment intent not successful', [
                'status' => $paymentIntent->status,
                'payment_intent_id' => $paymentIntent->id
            ]);
            return response()->json(['error' => __('Le paiement n\'a pas été confirmé.')], 400);
        }

        // Verify metadata matches request
        $metadata = $paymentIntent->metadata;
        if ($metadata['agent_id'] != Auth::id() || $metadata['property_id'] != $validated['property_id']) {
            $this->logPaymentDebug('Payment intent metadata mismatch', [
                'expected_agent_id' => Auth::id(),
                'actual_agent_id' => $metadata['agent_id'],
                'expected_property_id' => $validated['property_id'],
                'actual_property_id' => $metadata['property_id']
            ]);
            return response()->json(['error' => __('Données de paiement invalides.')], 400);
        }

        // Check if contact purchase already exists
        $existingPurchase = ContactPurchase::where('stripe_payment_intent_id', $validated['payment_intent_id'])->first();
        if ($existingPurchase) {
            $this->logPaymentDebug('Duplicate payment detected', [
                'existing_purchase_id' => $existingPurchase->id,
                'payment_intent_id' => $validated['payment_intent_id']
            ]);
            return response()->json(['error' => __('Ce paiement a déjà été traité.')], 400);
        }

        // Get property with owner
        try {
            $property = Property::with('proprietaire')->findOrFail($validated['property_id']);
            $this->logPaymentDebug('Property retrieved', [
                'property_id' => $property->id,
                'property_status' => $property->statut,
                'owner_id' => $property->proprietaire_id
            ]);
        } catch (\Exception $e) {
            $this->logPaymentDebug('Error retrieving property', [
                'property_id' => $validated['property_id'],
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => __('Propriété introuvable.')], 404);
        }

        // Verify property is still available
        if ($property->statut !== 'PUBLIE') {
            $this->logPaymentDebug('Property not available for purchase', [
                'property_status' => $property->statut
            ]);
            return response()->json(['error' => __('Cette propriété n\'est plus disponible.')], 400);
        }

        // Check if agent already purchased this contact
        $existingAgentPurchase = ContactPurchase::where('agent_id', Auth::id())
            ->where('property_id', $validated['property_id'])
            ->first();

        if ($existingAgentPurchase) {
            $this->logPaymentDebug('Agent already purchased this contact', [
                'existing_purchase_id' => $existingAgentPurchase->id
            ]);
            return response()->json(['error' => __('Vous avez déjà acheté ce contact.')], 400);
        }

        // Create contact purchase record
        try {
            $contactPurchase = ContactPurchase::create([
                'id' => Str::uuid(),
                'agent_id' => Auth::id(),
                'property_id' => $validated['property_id'],
                'stripe_payment_intent_id' => $validated['payment_intent_id'],
                'montant_paye' => $paymentIntent->amount / 100, // Convert from cents
                'devise' => $paymentIntent->currency,
                'statut_paiement' => ContactPurchase::STATUS_PENDING, // Start as pending
            ]);

            $this->logPaymentDebug('Contact purchase record created', [
                'purchase_id' => $contactPurchase->id,
                'amount' => $contactPurchase->montant_paye
            ]);
        } catch (\Exception $e) {
            $this->logPaymentDebug('Error creating contact purchase record', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => __('Erreur lors de l\'enregistrement de l\'achat.')], 500);
        }

        // Mark as succeeded and prepare contact data
        try {
            $contactData = [
                'nom' => $property->proprietaire->nom ?? 'N/A',
                'prenom' => $property->proprietaire->prenom ?? 'N/A',
                'email' => $property->proprietaire->email ?? 'N/A',
                'telephone' => $property->proprietaire->telephone ?? 'N/A',
            ];
            
            $contactPurchase->markPaymentSucceeded($contactData);
            $this->logPaymentDebug('Contact purchase marked as succeeded');
        } catch (\Exception $e) {
            $this->logPaymentDebug('Error marking payment as succeeded', [
                'error' => $e->getMessage()
            ]);
            // Continue processing even if this fails
        }

        // Send email notifications (with error handling)
        $this->sendPaymentSuccessEmails($contactPurchase);

        // Update property contact count
        try {
            if ($property->contacts_restants > 0) {
                $property->decrement('contacts_restants');
                $this->logPaymentDebug('Property contact count decremented', [
                    'contacts_remaining' => $property->contacts_restants - 1
                ]);
            }
        } catch (\Exception $e) {
            $this->logPaymentDebug('Error updating property contact count', [
                'error' => $e->getMessage()
            ]);
            // Continue processing even if this fails
        }

        Log::info('Contact purchase completed successfully', [
            'purchase_id' => $contactPurchase->id,
            'agent_id' => Auth::id(),
            'property_id' => $validated['property_id'],
            'amount' => $contactPurchase->montant_paye,
        ]);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => __('Paiement confirmé avec succès!'),
            'purchase_id' => $contactPurchase->id,
            'redirect_url' => route('payment.contact-details', $contactPurchase->id),
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        $this->logPaymentDebug('Validation error', [
            'errors' => $e->errors()
        ]);
        return response()->json([
            'error' => 'Validation failed',
            'details' => $e->errors()
        ], 422);

    } catch (ApiErrorException $e) {
        $this->logPaymentDebug('Stripe API error during confirmation', [
            'error' => $e->getMessage(),
            'stripe_error_code' => $e->getStripeCode(),
            'payment_intent_id' => $request->payment_intent_id ?? 'N/A'
        ]);

        return response()->json([
            'error' => __('Erreur lors de la confirmation du paiement.')
        ], 500);

    } catch (\Exception $e) {
        // Send payment failed email notifications
        $this->sendPaymentFailedEmails($request, $e->getMessage());
        
        $this->logPaymentDebug('Unexpected error during payment confirmation', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'payment_intent_id' => $request->payment_intent_id ?? 'N/A',
            'property_id' => $request->property_id ?? 'N/A'
        ]);

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
 * Enhanced logging for payment debugging
 */
private function logPaymentDebug($message, $context = [])
{
    $debugContext = array_merge($context, [
        'timestamp' => now()->toISOString(),
        'user_id' => auth()->id(),
        'user_agent' => request()->userAgent(),
        'ip' => request()->ip(),
    ]);
    
    Log::info("PAYMENT_DEBUG: {$message}", $debugContext);
    
    // Also write to a specific payment debug log
    $debugLog = storage_path('logs/payment_debug.log');
    $logEntry = "[" . now()->toISOString() . "] {$message} " . json_encode($debugContext) . PHP_EOL;
    file_put_contents($debugLog, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Send payment success email notifications
 */
private function sendPaymentSuccessEmails($contactPurchase)
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
        
        $this->logPaymentDebug('Payment success emails sent', [
            'purchase_id' => $contactPurchase->id,
            'agent_email' => $contactPurchase->agent->email,
            'admin_count' => $admins->count()
        ]);
    } catch (\Exception $e) {
        $this->logPaymentDebug('Failed to send payment success emails', [
            'error' => $e->getMessage()
        ]);
    }
}

/**
 * Send payment failed email notifications
 */
private function sendPaymentFailedEmails(Request $request, $errorMessage = null)
{
    try {
        $agent = Auth::user();
        $property = null;
        
        // Try to get property if property_id is available
        if ($request->has('property_id')) {
            $property = Property::find($request->property_id);
        }
        
        // Create a mock purchase object for email template
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
        
        $this->logPaymentDebug('Payment failed emails sent', [
            'agent_email' => $agent->email,
            'admin_count' => $admins->count(),
            'error_message' => $errorMessage
        ]);
        
    } catch (\Exception $e) {
        $this->logPaymentDebug('Failed to send payment failed emails', [
            'error' => $e->getMessage()
        ]);
    }
}
