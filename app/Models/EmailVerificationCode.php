<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerificationCodeMail;

class EmailVerificationCode extends Model
{
    protected $fillable = ['email', 'code', 'expires_at'];
    
    protected $casts = [
        'expires_at' => 'datetime',
    ];
    
    public $timestamps = false;
    
    /**
     * Generate and send verification code
     */
    public static function generateAndSend($email)
    {
        // Delete old codes for this email
        self::where('email', $email)->delete();
        
        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Create new verification record
        $verification = self::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(15) // 15 minutes expiry
        ]);
        
        // Send email with code
        try {
            Mail::to($email)->send(new EmailVerificationCodeMail($code));
            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Verify code
     */
    public static function verify($email, $code)
    {
        $verification = self::where('email', $email)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->first();
            
        if ($verification) {
            // Delete the used code
            $verification->delete();
            return true;
        }
        
        return false;
    }
    
    /**
     * Clean expired codes
     */
    public static function cleanup()
    {
        self::where('expires_at', '<', now())->delete();
    }
}
