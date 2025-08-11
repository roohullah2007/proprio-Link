{{-- resources/views/emails/layout-blue.blade.php --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('subject') - Proprio Link</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f8fafc;
            color: #374151;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-decoration: none;
            display: block;
        }
        
        .tagline {
            color: #e0e7ff;
            font-size: 14px;
            margin: 8px 0 0 0;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 20px 0;
            text-align: center;
        }
        
        .message {
            margin: 0 0 16px 0;
            color: #374151;
            font-size: 16px;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            transform: translateY(-1px);
        }
        
        .highlight-box {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 6px 6px 0;
        }
        
        .highlight-box h3 {
            margin: 0 0 12px 0;
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
        }
        
        .success-badge {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #15803d;
            padding: 12px 16px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        }
        
        .warning-badge {
            background-color: #fefce8;
            border: 1px solid #fde047;
            color: #a16207;
            padding: 12px 16px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        }
        
        .info-badge {
            background-color: #eff6ff;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 12px 16px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
            font-weight: 500;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin: 0 0 8px 0;
        }
        
        .footer-links {
            margin: 16px 0;
        }
        
        .footer-link {
            color: #2563eb;
            text-decoration: none;
            font-size: 14px;
            margin: 0 12px;
        }
        
        .footer-link:hover {
            text-decoration: underline;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 24px 0;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .logo {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 18px;
            }
            
            .message {
                font-size: 15px;
            }
            
            .button {
                display: block;
                text-align: center;
                margin: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <a href="{{ config('app.url') }}" class="logo">Proprio Link</a>
            <p class="tagline">Plateforme immobilière professionnelle</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            @yield('content')
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                Cet email a été envoyé automatiquement par Proprio Link
            </p>
            <p class="footer-text">
                Si vous avez des questions, contactez notre équipe support
            </p>
            
            <div class="footer-links">
                @php
                    $websiteUrl = \App\Models\EmailSetting::get('website_url', 'https://proprio-link.fr');
                @endphp
                <a href="{{ $websiteUrl }}" class="footer-link">{{ $websiteUrl }}</a>
            </div>
            
            <div class="divider"></div>
            
            <p class="footer-text">
                © {{ date('Y') }} Proprio Link. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
