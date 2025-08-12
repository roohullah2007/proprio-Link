<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ContactPurchaseController extends Controller
{
    /**
     * Purchase contact information for any property ID
     */
    public function purchaseContact(Request $request, string $propertyId)
    {
        $request->validate([
            'buyer_name' => 'required|string|max:255',
            'buyer_email' => 'required|email',
            'payment_method' => 'string|in:stripe,paypal'
        ]);
        
        try {
            // Create contact purchase record (simulating successful payment)
            DB::table('contact_purchases_simple')->insert([
                'property_id' => $propertyId,
                'user_id' => Auth::id(),
                'session_id' => Session::getId(),
                'buyer_name' => $request->buyer_name,
                'buyer_email' => $request->buyer_email,
                'amount' => 15.00,
                'payment_method' => $request->payment_method ?? 'stripe',
                'payment_status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Contact information purchased successfully!'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }
}