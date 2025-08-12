<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful - Proprio Link</title>
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Proprio Link</div>
            <h2>Payment Confirmed!</h2>
        </div>
        
        <div class="content">
            <h3 class="success">✅ Payment Successful</h3>
            <p>Dear {{ $purchase->agent->prenom ?? 'Agent' }},</p>
            
            <p>Great news! Your payment has been processed successfully. You now have access to the property owner's contact information.</p>
            
            <div class="details">
                <h4>Purchase Details:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Amount:</strong> €{{ number_format($purchase->montant_paye ?? 0, 2) }}</li>
                    <li><strong>Property:</strong> {{ $purchase->property->adresse_complete ?? 'N/A' }}</li>
                    <li><strong>Date:</strong> {{ $purchase->created_at ? $purchase->created_at->format('d/m/Y H:i') : 'N/A' }}</li>
                </ul>
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $contactDetailsUrl ?? '#' }}" class="button">View Contact Information</a>
            </p>
            
            <p><strong>What's Next?</strong></p>
            <ul>
                <li>Access the complete owner contact information</li>
                <li>Contact the property owner directly</li>
                <li>Propose your real estate services</li>
            </ul>
            
            <p>Thank you for using Proprio Link!</p>
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
