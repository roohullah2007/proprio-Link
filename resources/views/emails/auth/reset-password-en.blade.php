@extends('emails.layout')

@section('content')
<div class="greeting">
    Hello {{ $user->prenom }},
</div>

<div class="message">
    <p>You are receiving this email because we received a password reset request for your Proprio Link account.</p>
    <p>If you did not request a password reset, no further action is required. Your account remains secure.</p>
</div>

<div style="text-align: center; margin: 40px 0;">
    <a href="{{ $url }}" class="button">
        🔐 Reset Your Password
    </a>
</div>

<div class="highlight-box">
    <h3>Important Security Information</h3>
    <ul>
        <li><strong>This password reset link will expire in {{ $count }} minutes</strong></li>
        <li>The link can only be used once</li>
        <li>If you didn't request this reset, please ignore this email</li>
        <li>For security, we recommend using a strong, unique password</li>
    </ul>
</div>

<div class="message">
    <p><strong>Account Details:</strong></p>
    <ul>
        <li><strong>Email:</strong> {{ $user->email }}</li>
        <li><strong>Account Type:</strong> 
            @if($user->type_utilisateur === 'AGENT')
                Real Estate Agent
            @elseif($user->type_utilisateur === 'PROPRIETAIRE')
                Property Owner
            @else
                {{ $user->type_utilisateur }}
            @endif
        </li>
        <li><strong>Request Time:</strong> {{ now()->format('d/m/Y H:i') }}</li>
    </ul>
</div>

<div class="message">
    <p><strong>Trouble clicking the button?</strong> Copy and paste the following URL into your browser:</p>
    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; word-break: break-all; font-size: 14px;">
        {{ $url }}
    </p>
</div>

<div class="message">
    <p><strong>Need Help?</strong></p>
    <p>If you continue to have problems resetting your password, please contact our support team. We're here to help ensure you can access your Proprio Link account securely.</p>
    
    <p><strong>Security Tips:</strong></p>
    <ul>
        <li>Use a password that's at least 8 characters long</li>
        <li>Include a mix of letters, numbers, and symbols</li>
        <li>Don't reuse passwords from other websites</li>
        <li>Consider using a password manager</li>
    </ul>
</div>
@endsection
