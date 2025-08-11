@extends('emails.layout')

@section('subject', 'Réinitialisation de votre mot de passe - Proprio Link')

@section('content')
    <div class="greeting">
        Bonjour {{ $user->prenom ?? 'Utilisateur' }},
    </div>

    <div class="message">
        Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Proprio Link.
    </div>

    <div class="highlight-box">
        <h3>🔒 Réinitialisation de mot de passe</h3>
        <p style="margin: 0; margin-bottom: 15px;">
            Pour définir un nouveau mot de passe, cliquez sur le bouton ci-dessous. Ce lien est valable pendant <strong>60 minutes</strong>.
        </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $resetUrl }}" class="button">
            🔑 Réinitialiser mon mot de passe
        </a>
    </div>

    <div class="message">
        <strong>Lien ne fonctionne pas ?</strong><br>
        Copiez et collez l'URL suivante dans votre navigateur :<br>
        <a href="{{ $resetUrl }}" style="color: #2563eb; word-break: break-all; font-size: 14px;">{{ $resetUrl }}</a>
    </div>

    <div class="highlight-box" style="background-color: #fef3cd; border-left-color: #f59e0b;">
        <h3 style="color: #f59e0b;">⚠️ Sécurité importante</h3>
        <div style="font-size: 14px; color: #92400e;">
            • Si vous n'avez pas demandé cette réinitialisation, ignorez cet email<br>
            • Votre mot de passe actuel reste inchangé<br>
            • Ce lien expire dans 60 minutes<br>
            • Ne partagez jamais ce lien avec personne d'autre
        </div>
    </div>

    <div class="message">
        <strong>Informations de votre compte :</strong><br>
        📧 Email : {{ $user->email }}<br>
        🕐 Demande effectuée le : {{ now()->format('d/m/Y à H:i') }}<br>
        🔐 Type de compte : {{ ucfirst(strtolower($user->type_utilisateur ?? 'Utilisateur')) }}
    </div>

    <div class="message">
        <strong>Besoin d'aide ?</strong><br>
        Si vous rencontrez des difficultés, contactez notre équipe support via le site web ou consultez notre aide en ligne.
    </div>

    <div class="message">
        Ce lien de réinitialisation a été généré pour des raisons de sécurité. Si vous n'avez pas demandé cette réinitialisation, 
        vous pouvez ignorer cet email en toute sécurité.
    </div>
@endsection
