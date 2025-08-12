<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - Admin Notification</title>
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
        .admin-badge { background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Proprio Link</div>
            <h2>Payment Failed</h2>
            <span class="admin-badge">Admin Notification</span>
        </div>
        
        <div class="content">
            <h3 class="error">❌ Payment Attempt Failed</h3>
            <p>Dear Administrator,</p>
            
            <p>A payment attempt has failed on the platform. Here are the details:</p>
            
            <div class="error-details">
                <h4>Failed Transaction Details:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Agent:</strong> {{ isset($purchase->agent) ? $purchase->agent->prenom . ' ' . $purchase->agent->nom : 'Unknown' }} ({{ isset($purchase->agent) ? $purchase->agent->email : 'N/A' }})</li>
                    <li><strong>Property:</strong> {{ isset($purchase->property) ? $purchase->property->adresse_complete : 'N/A' }}</li>
                    <li><strong>Timestamp:</strong> {{ isset($purchase->created_at) ? $purchase->created_at->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</li>
                    @if(isset($errorMessage) && !empty($errorMessage))
                        <li><strong>Error:</strong> {{ $errorMessage }}</li>
                    @endif
                </ul>
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $adminDashboardUrl ?? '#' }}" class="button">View Admin Dashboard</a>
            </p>
            
            <p><strong>Action Required:</strong></p>
            <ul>
                <li>Monitor payment failure patterns</li>
                <li>Check Stripe dashboard for detailed error information</li>
                <li>Consider reaching out to the agent if needed</li>
                <li>Review payment system configuration if failures persist</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Proprio Link. All rights reserved.</p>
            <p>
                <a href="https://proprio-link.fr/">Visit Proprio Link</a> | 
                <a href="https://proprio-link.fr/contact/">Admin Support</a>
            </p>
        </div>
    </div>
</body>
</html>
