<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('subject', 'Proprio Link')</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .tagline {
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .message {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .highlight-box {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .highlight-box h3 {
            color: #2563eb;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .footer-text {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
        }
        .contact-info {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }
        .success-badge {
            background-color: #d4edda;
            color: #155724;
            padding: 10px 15px;
            border-radius: 20px;
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            margin: 15px 0;
        }
        .warning-badge {
            background-color: #fff3cd;
            color: #856404;
            padding: 10px 15px;
            border-radius: 20px;
            display: inline-block;
            font-size: 14px;
            font-weight: 600;
            margin: 15px 0;
        }
        .property-card {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            background-color: #fafafa;
        }
        .property-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .property-details {
            color: #666;
            font-size: 14px;
        }
        .price {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PROPRIO LINK</div>
            <div class="tagline">Plateforme immobilière professionnelle</div>
        </div>
        
        <div class="content">
            @yield('content')
        </div>
        
        <div class="footer">
            <div class="footer-text">
                Merci de faire confiance à Proprio Link pour vos besoins immobiliers.
            </div>
            
            <div class="social-links">
                @php
                    $websiteUrl = \App\Models\EmailSetting::get('website_url', 'https://proprio-link.fr');
                @endphp
                <a href="{{ $websiteUrl }}">{{ $websiteUrl }}</a>
            </div>
            
            <div class="contact-info">
                Proprio Link - Plateforme immobilière professionnelle<br>
                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
            </div>
        </div>
    </div>
</body>
</html>
