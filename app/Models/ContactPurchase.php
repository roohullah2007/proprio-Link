<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class ContactPurchase extends Model
{
    use HasFactory, HasUuids;

    /**
     * The "type" of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'agent_id',
        'property_id',
        'stripe_payment_intent_id',
        'montant_paye',
        'devise',
        'statut_paiement',
        'donnees_contact',
        'paiement_confirme_a',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'montant_paye' => 'decimal:2',
            'donnees_contact' => 'array',
            'paiement_confirme_a' => 'datetime',
        ];
    }

    /**
     * Payment status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_SUCCEEDED = 'succeeded';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELED = 'canceled';

    /**
     * Relationship with agent (user)
     */
    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    /**
     * Relationship with property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get formatted price
     */
    public function getMontantFormatteAttribute(): string
    {
        return number_format($this->montant_paye, 2, ',', ' ') . ' ' . $this->devise;
    }

    /**
     * Set encrypted contact data
     */
    public function setDonneesContactAttribute($value)
    {
        if ($value !== null) {
            $this->attributes['donnees_contact'] = Crypt::encryptString(json_encode($value));
        }
    }

    /**
     * Get decrypted contact data
     */
    public function getDonneesContactAttribute($value)
    {
        if ($value === null) {
            return null;
        }
        
        try {
            return json_decode(Crypt::decryptString($value), true);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Check if payment is completed
     */
    public function isPaymentCompleted(): bool
    {
        return $this->statut_paiement === self::STATUS_SUCCEEDED;
    }

    /**
     * Check if payment is pending
     */
    public function isPaymentPending(): bool
    {
        return $this->statut_paiement === self::STATUS_PENDING;
    }

    /**
     * Mark payment as succeeded
     */
    public function markPaymentSucceeded(array $contactData = null): void
    {
        $this->update([
            'statut_paiement' => self::STATUS_SUCCEEDED,
            'paiement_confirme_a' => now(),
            'donnees_contact' => $contactData,
        ]);

        // Auto-generate invoice when payment succeeds
        try {
            $this->generateInvoice();
            \Log::info('Invoice generated successfully for purchase: ' . $this->id);
        } catch (\Exception $e) {
            \Log::error('Failed to generate invoice for purchase ' . $this->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Generate invoice for this purchase
     */
    public function generateInvoice(): ?\App\Models\Invoice
    {
        // Check if invoice already exists
        if ($this->invoice) {
            return $this->invoice;
        }

        // Only create invoice for successful payments
        if ($this->statut_paiement !== self::STATUS_SUCCEEDED) {
            return null;
        }

        // Use database transaction to prevent duplicate invoice creation
        return \DB::transaction(function () {
            // Double-check if invoice exists (in case of race condition)
            $existingInvoice = \App\Models\Invoice::where('contact_purchase_id', $this->id)->first();
            if ($existingInvoice) {
                return $existingInvoice;
            }

            $invoice = new \App\Models\Invoice();
            $invoiceNumber = $invoice->generateInvoiceNumber();

            return \App\Models\Invoice::create([
                'invoice_number' => $invoiceNumber,
                'contact_purchase_id' => $this->id,
                'agent_name' => $this->agent->prenom . ' ' . $this->agent->nom,
                'agent_email' => $this->agent->email,
                'property_reference' => $this->property ? 
                    $this->property->type_propriete . ' - ' . $this->property->ville : 
                    'Property Reference',
                'amount' => $this->montant_paye,
                'currency' => $this->devise,
                'billing_details' => [
                    'agent' => [
                        'name' => $this->agent->prenom . ' ' . $this->agent->nom,
                        'email' => $this->agent->email,
                        'phone' => $this->agent->telephone,
                        'siret' => $this->agent->numero_siret,
                    ],
                    'property' => $this->property ? [
                        'type' => $this->property->type_propriete,
                        'city' => $this->property->ville,
                        'price' => $this->property->prix,
                    ] : null,
                    'purchase_date' => $this->paiement_confirme_a,
                    'stripe_payment_id' => $this->stripe_payment_intent_id,
                ],
                'issued_at' => $this->paiement_confirme_a ?: now(),
            ]);
        });
    }

    /**
     * Mark payment as failed
     */
    public function markPaymentFailed(): void
    {
        $this->update([
            'statut_paiement' => self::STATUS_FAILED,
        ]);
    }

    /**
     * Scope for successful payments
     */
    public function scopeSuccessful($query)
    {
        return $query->where('statut_paiement', self::STATUS_SUCCEEDED);
    }

    /**
     * Relationship with invoice
     */
    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * Scope for pending payments
     */
    public function scopePending($query)
    {
        return $query->where('statut_paiement', self::STATUS_PENDING);
    }
}
