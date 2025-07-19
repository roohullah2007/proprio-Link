<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactPurchase;
use App\Models\Invoice;
use App\Models\User;
use App\Models\Property;

class InvoiceTestSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Find an agent and a property owner
        $agent = User::where('type_utilisateur', 'AGENT')->first();
        $owner = User::where('type_utilisateur', 'PROPRIETAIRE')->first();
        
        if (!$agent || !$owner) {
            $this->command->info('No agent or owner found. Create users first.');
            return;
        }

        // Find a property
        $property = Property::where('statut', 'PUBLIE')->first();
        
        if (!$property) {
            $this->command->info('No published property found. Create properties first.');
            return;
        }

        // Create a successful contact purchase
        $purchase = ContactPurchase::create([
            'agent_id' => $agent->id,
            'property_id' => $property->id,
            'stripe_payment_intent_id' => 'pi_test_' . uniqid(),
            'montant_paye' => 15.00,
            'devise' => 'EUR',
            'statut_paiement' => ContactPurchase::STATUS_SUCCEEDED,
            'paiement_confirme_a' => now(),
            'donnees_contact' => [
                'nom' => $property->proprietaire->nom,
                'prenom' => $property->proprietaire->prenom,
                'email' => $property->proprietaire->email,
                'telephone' => $property->proprietaire->telephone,
            ]
        ]);

        // Create invoice for this purchase
        $invoice = new Invoice();
        $invoiceNumber = $invoice->generateInvoiceNumber();

        Invoice::create([
            'invoice_number' => $invoiceNumber,
            'contact_purchase_id' => $purchase->id,
            'agent_name' => $agent->prenom . ' ' . $agent->nom,
            'agent_email' => $agent->email,
            'property_reference' => $property->type_propriete . ' - ' . $property->ville,
            'amount' => $purchase->montant_paye,
            'currency' => $purchase->devise,
            'billing_details' => [
                'agent' => [
                    'name' => $agent->prenom . ' ' . $agent->nom,
                    'email' => $agent->email,
                    'phone' => $agent->telephone,
                    'siret' => $agent->numero_siret,
                ],
                'property' => [
                    'type' => $property->type_propriete,
                    'city' => $property->ville,
                    'price' => $property->prix,
                ],
                'purchase_date' => $purchase->paiement_confirme_a,
                'stripe_payment_id' => $purchase->stripe_payment_intent_id,
            ],
            'issued_at' => now(),
        ]);

        $this->command->info('Test invoice created successfully!');
        $this->command->info("Invoice Number: {$invoiceNumber}");
        $this->command->info("Agent: {$agent->prenom} {$agent->nom}");
        $this->command->info("Property: {$property->type_propriete} - {$property->ville}");
        $this->command->info("Amount: €{$purchase->montant_paye}");
    }
}
