<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
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
        'invoice_number',
        'contact_purchase_id',
        'agent_name',
        'agent_email',
        'property_reference',
        'amount',
        'currency',
        'billing_details',
        'pdf_path',
        'issued_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'billing_details' => 'array',
            'issued_at' => 'datetime',
        ];
    }

    /**
     * Relationship with contact purchase
     */
    public function contactPurchase()
    {
        return $this->belongsTo(ContactPurchase::class);
    }

    /**
     * Generate a unique invoice number
     */
    public function generateInvoiceNumber(): string
    {
        $year = now()->year;
        
        // Use database transaction to prevent race conditions
        return \DB::transaction(function () use ($year) {
            // Lock the table to prevent concurrent invoice creation
            $lastInvoice = self::whereYear('created_at', $year)
                ->lockForUpdate()
                ->orderBy('created_at', 'desc')
                ->first();
            
            $nextNumber = $lastInvoice ? 
                (int) substr($lastInvoice->invoice_number, -6) + 1 : 1;
            
            // Try to find a unique number if collision occurs
            $attempts = 0;
            do {
                $invoiceNumber = 'INV-' . $year . '-' . str_pad($nextNumber + $attempts, 6, '0', STR_PAD_LEFT);
                $exists = self::where('invoice_number', $invoiceNumber)->exists();
                $attempts++;
            } while ($exists && $attempts < 1000);
            
            if ($attempts >= 1000) {
                throw new \Exception('Unable to generate unique invoice number');
            }
            
            return $invoiceNumber;
        });
    }

    /**
     * Get formatted amount
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->amount, 2, ',', ' ') . ' ' . $this->currency;
    }
}
