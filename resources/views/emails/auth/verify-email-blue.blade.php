{{-- resources/views/emails/auth/verify-email-blue.blade.php --}}
@extends('emails.layout-blue')

@section('subject', 'Vérifiez votre adresse email - Proprio Link')

@section('content')
    <div class="greeting">
        Bienvenue {{ $user->prenom ?? 'Nouvel utilisateur' }} !
    </div>

    <div class="message">
        Merci de vous être inscrit sur Proprio Link ! Pour compléter votre inscription et accéder à toutes les fonctionnalités 
        de notre plateforme immobilière, nous devons vérifier votre adresse email.
    </div>

    <div class="success-badge">
        Votre compte {{ ucfirst(strtolower($user->type_utilisateur ?? 'utilisateur')) }} a été créé avec succès !
    </div>

    <div class="highlight-box">
        <h3>Vérification de votre email</h3>
        <p style="margin: 0; margin-bottom: 15px;">
            Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre compte.
        </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $verificationUrl }}" class="button">
            Vérifier mon adresse email
        </a>
    </div>

    <div class="message">
        <strong>Lien ne fonctionne pas ?</strong><br>
        Copiez et collez l'URL suivante dans votre navigateur :<br>
        <a href="{{ $verificationUrl }}" style="color: #2563eb; word-break: break-all; font-size: 14px;">{{ $verificationUrl }}</a>
    </div>

    @if($user->type_utilisateur === 'AGENT')
        <div class="highlight-box">
            <h3>Prochaines étapes pour les agents :</h3>
            <div style="font-size: 14px;">
                1. <strong>Vérifiez votre email</strong> (étape actuelle)<br>
                2. <strong>Complétez votre profil</strong> avec vos informations professionnelles<br>
                3. <strong>Attendez l'approbation</strong> de notre équipe de modération<br>
                4. <strong>Commencez à explorer</strong> les propriétés disponibles
            </div>
        </div>

        <div class="warning-badge">
            Vérification requise pour les agents immobiliers
        </div>

    @elseif($user->type_utilisateur === 'PROPRIETAIRE')
        <div class="highlight-box">
            <h3>Prochaines étapes pour les propriétaires :</h3>
            <div style="font-size: 14px;">
                1. <strong>Vérifiez votre email</strong> (étape actuelle)<br>
                2. <strong>Complétez votre profil</strong> utilisateur<br>
                3. <strong>Ajoutez votre première propriété</strong> avec photos et détails<br>
                4. <strong>Recevez des contacts</strong> d'agents qualifiés
            </div>
        </div>
    @endif

    <div class="highlight-box" style="background-color: #fef3cd; border-left-color: #f59e0b;">
        <h3 style="color: #d97706;">Important</h3>
        <div style="font-size: 14px; color: #92400e;">
            • Ce lien de vérification est unique et personnel<br>
            • Il expire après quelques heures pour votre sécurité<br>
            • Une fois vérifié, votre compte sera pleinement activé<br>
            • Conservez cet email jusqu'à la vérification
        </div>
    </div>

    <div class="message">
        <strong>Informations de votre compte :</strong><br>
        Email à vérifier : {{ $user->email }}<br>
        Type de compte : {{ ucfirst(strtolower($user->type_utilisateur ?? 'Utilisateur')) }}<br>
        Inscription : {{ $user->created_at ? $user->created_at->format('d/m/Y à H:i') : now()->format('d/m/Y à H:i') }}
    </div>

    <div class="message">
        <strong>Pourquoi vérifier votre email ?</strong><br>
        • Sécuriser votre compte contre les accès non autorisés<br>
        • Recevoir les notifications importantes de la plateforme<br>
        • Accéder à toutes les fonctionnalités selon votre type de compte<br>
        • Permettre la récupération de mot de passe si nécessaire
    </div>

    <div class="message">
        <strong>Besoin d'aide ?</strong><br>
        Si vous n'arrivez pas à vérifier votre email ou si vous rencontrez des problèmes, 
        contactez notre équipe support via le site web.
    </div>

    <div class="message">
        Cordialement,<br>
        L'équipe Proprio Link
    </div>

    <div class="divider"></div>

    <div class="message" style="font-size: 14px; color: #6b7280;">
        Si vous n'avez pas créé de compte sur Proprio Link, ignorez cet email. 
        Aucune action ne sera effectuée sur votre adresse email.
    </div>
@endsection
