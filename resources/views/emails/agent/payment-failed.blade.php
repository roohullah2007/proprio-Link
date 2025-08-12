<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Proprio Link</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: #dc3545; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; background: white; border-radius: 0 0 8px 8px; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
        .error { color: #dc3545; font-size: 18px; font-weight: bold; }
        .error-details { background: #ffe6e6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545; }
        .logo { font-size: 24px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Proprio Link</div>
            <h2>Payment Failed</h2>
        </div>
        
        <div class="content">
            <h3 class="error">❌ Payment Could Not Be Processed</h3>
            <p>Dear {{ isset($purchase->agent) ? $purchase->agent->prenom : 'Agent' }},</p>
            
            <p>Unfortunately, your payment could not be processed. Please don't worry - no charges have been made to your account.</p>
            
            @if(isset($errorMessage) && !empty($errorMessage))
                <div class="error-details">
                    <strong>Error Details:</strong><br>
                    {{ $errorMessage }}
                </div>
            @endif
            
            <p><strong>What to do next:</strong></p>
            <ul>
                <li>Check your payment method and try again</li>
                <li>Ensure your card has sufficient funds</li>
                <li>Verify your billing information is correct</li>
                <li>Contact support if the problem persists</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{ env('APP_URL') }}" class="button">Try Payment Again</a>
            </p>
            
            <p>If you continue to experience issues, please contact our support team for assistance.</p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Proprio Link. All rights reserved.</p>
            <p>
                <a href="https://proprio-link.fr/">Visit Proprio Link</a> | 
                <a href="https://proprio-link.fr/contact/">Support</a>
            </p>
        </div>
    </div>
</body>
</html>
