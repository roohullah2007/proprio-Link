<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - Admin Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: #1e40af; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; background: white; border-radius: 0 0 8px 8px; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
        .success { color: #3b82f6; font-size: 18px; font-weight: bold; }
        .details { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af; }
        .logo { font-size: 24px; font-weight: bold; }
        .admin-badge { background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Proprio Link</div>
            <h2>Contact Purchase Completed</h2>
            <span class="admin-badge">Admin Notification</span>
        </div>
        
        <div class="content">
            <h3 class="success">✅ Payment Successful</h3>
            <p>Dear Administrator,</p>
            
            <p>A contact purchase has been completed successfully on the platform.</p>
            
            <div class="details">
                <h4>Transaction Details:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Agent:</strong> {{ $purchase->agent->prenom ?? '' }} {{ $purchase->agent->nom ?? '' }} ({{ $purchase->agent->email ?? 'N/A' }})</li>
                    <li><strong>Amount:</strong> €{{ number_format($purchase->montant_paye ?? 0, 2) }}</li>
                    <li><strong>Property:</strong> {{ $purchase->property->adresse_complete ?? 'N/A' }}</li>
                    <li><strong>Owner:</strong> {{ $purchase->property->proprietaire->prenom ?? '' }} {{ $purchase->property->proprietaire->nom ?? '' }}</li>
                    <li><strong>Date:</strong> {{ $purchase->created_at ? $purchase->created_at->format('d/m/Y H:i') : 'N/A' }}</li>
                </ul>
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $adminDashboardUrl ?? '#' }}" class="button">View Admin Dashboard</a>
            </p>
            
            <p><strong>Platform Statistics:</strong></p>
            <ul>
                <li>This transaction contributes to platform revenue</li>
                <li>Agent now has access to verified contact information</li>
                <li>Property owner will be contacted for services</li>
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
