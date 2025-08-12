@extends('emails.layout')

@section('content')
<div class="greeting">
    Bonjour {{ $user->prenom }},
</div>

<div class="message">
    <p>Vous recevez cet email car nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Proprio Link.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, aucune action supplémentaire n'est requise. Votre compte reste sécurisé.</p>
</div>

<div style="text-align: center; margin: 40px 0;">
    <a href="{{ $url }}" class="button">
        🔐 Réinitialiser Mon Mot de Passe
    </a>
</div>

<div class="highlight-box">
    <h3>Informations Importantes de Sécurité</h3>
    <ul>
        <li><strong>Ce lien de réinitialisation expirera dans {{ $count }} minutes</strong></li>
        <li>Le lien ne peut être utilisé qu'une seule fois</li>
        <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
        <li>Pour la sécurité, nous recommandons d'utiliser un mot de passe fort et unique</li>
    </ul>
</div>

<div class="message">
    <p><strong>Détails du Compte :</strong></p>
    <ul>
        <li><strong>Email :</strong> {{ $user->email }}</li>
        <li><strong>Type de Compte :</strong> 
            @if($user->type_utilisateur === 'AGENT')
                Agent Immobilier
            @elseif($user->type_utilisateur === 'PROPRIETAIRE')
                Propriétaire
            @else
                {{ $user->type_utilisateur }}
            @endif
        </li>
        <li><strong>Heure de Demande :</strong> {{ now()->format('d/m/Y H:i') }}</li>
    </ul>
</div>

<div class="message">
    <p><strong>Problème avec le bouton ?</strong> Copiez et collez l'URL suivante dans votre navigateur :</p>
    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; font-family: monospace; word-break: break-all; font-size: 14px;">
        {{ $url }}
    </p>
</div>

<div class="message">
    <p><strong>Besoin d'Aide ?</strong></p>
    <p>Si vous continuez à avoir des problèmes pour réinitialiser votre mot de passe, veuillez contacter notre équipe de support. Nous sommes là pour vous aider à accéder à votre compte Proprio Link en toute sécurité.</p>
    
    <p><strong>Conseils de Sécurité :</strong></p>
    <ul>
        <li>Utilisez un mot de passe d'au moins 8 caractères</li>
        <li>Incluez un mélange de lettres, chiffres et symboles</li>
        <li>Ne réutilisez pas les mots de passe d'autres sites web</li>
        <li>Considérez l'utilisation d'un gestionnaire de mots de passe</li>
    </ul>
</div>
@endsection
