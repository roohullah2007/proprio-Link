@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Compte supprimé
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Votre compte Proprio Link a été supprimé
    </p>
</div>

<div style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #DC2626; font-size: 14px; margin: 0;">
        <strong>Notification importante :</strong> Votre compte {{ $user->email }} a été définitivement supprimé de notre plateforme.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $user->first_name }} {{ $user->last_name }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous vous informons que votre compte Proprio Link a été définitivement supprimé par notre équipe d'administration.
    </p>
    
    @if($reason)
    <div style="background-color: #F3F4F6; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0;">
        <p style="color: #4B5563; font-size: 14px; margin: 0;">
            <strong>Raison de la suppression :</strong><br>
            {{ $reason }}
        </p>
    </div>
    @endif
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        <strong>Ce qui a été supprimé :</strong>
    </p>
    
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        <li>Votre profil utilisateur</li>
        <li>Toutes vos données personnelles</li>
        @if($user->role === 'agent')
        <li>Votre historique d'achats de contacts</li>
        <li>Vos recherches sauvegardées</li>
        @elseif($user->role === 'owner')
        <li>Toutes vos annonces de propriétés</li>
        <li>Les photos et descriptions de vos biens</li>
        @endif
        <li>Votre historique de transactions</li>
        <li>Tous les messages et communications</li>
    </ul>
    
    <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #92400E; font-size: 14px; margin: 0;">
            <strong>⚠️ Important :</strong><br>
            Cette suppression est définitive et irréversible. Toutes vos données ont été effacées de nos serveurs conformément à notre politique de confidentialité et aux réglementations en vigueur (RGPD).
        </p>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        <strong>Vous ne pourrez plus :</strong><br>
        • Vous connecter à votre ancien compte<br>
        • Récupérer vos données ou historiques<br>
        • Utiliser les services Proprio Link avec cette adresse email
    </p>
    
    <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #1E40AF; font-size: 14px; margin: 0;">
            <strong>Si vous souhaitez revenir :</strong><br>
            Vous pouvez créer un nouveau compte à tout moment en vous inscrivant normalement sur notre plateforme. Cependant, vous devrez recommencer depuis le début (nouvelles annonces, nouveau profil, etc.).
        </p>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous pensez que cette suppression est une erreur ou si vous avez des questions, 
        veuillez nous contacter dans les plus brefs délais à : <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous vous remercions d'avoir utilisé Proprio Link.
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Cet email a été envoyé automatiquement suite à la suppression de votre compte.<br>
        Proprio Link - Plateforme immobilière professionnelle
    </p>
</div>
@endsection