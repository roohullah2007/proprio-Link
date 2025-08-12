@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Vérification révoquée
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Votre vérification de compte a été révoquée
    </p>
</div>

<div style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #DC2626; font-size: 14px; margin: 0;">
        <strong>Important :</strong> La vérification de votre compte {{ $user->email }} a été révoquée par notre équipe de modération.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $user->prenom ?? $user->first_name }} {{ $user->nom ?? $user->last_name }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous vous informons que la vérification de votre compte Proprio Link a été révoquée suite à une révision de notre équipe d'administration.
    </p>
    
    @if($reason)
    <div style="background-color: #F3F4F6; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
        <p style="color: #4B5563; font-size: 14px; margin: 0;">
            <strong>Raison de la révocation :</strong><br>
            {{ $reason }}
        </p>
    </div>
    @endif
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Conséquences de cette action :
    </p>
    
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        @if(($user->role ?? $user->type_utilisateur) === 'agent' || ($user->role ?? $user->type_utilisateur) === 'AGENT')
        <li>Votre badge de vérification a été retiré</li>
        <li>Vous ne pouvez plus acheter de contacts de propriétaires</li>
        <li>Votre profil n'apparaît plus comme vérifié</li>
        <li>L'accès à certaines fonctionnalités premium est suspendu</li>
        @elseif(($user->role ?? $user->type_utilisateur) === 'owner' || ($user->role ?? $user->type_utilisateur) === 'PROPRIETAIRE')
        <li>Vos propriétés ne sont plus visibles publiquement</li>
        <li>Les agents ne peuvent plus vous contacter</li>
        <li>Votre profil n'apparaît plus comme vérifié</li>
        @endif
        <li>Vous pouvez toujours accéder à votre compte</li>
    </ul>
    
    <div style="background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #1E40AF; font-size: 14px; margin: 0;">
            <strong>Comment retrouver la vérification :</strong><br>
            1. Contactez notre équipe de support<br>
            2. Fournissez les documents ou informations demandés<br>
            3. Attendez la nouvelle vérification de votre profil<br>
            4. Votre statut vérifié sera restauré une fois la révision terminée
        </p>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous avez des questions concernant cette décision ou si vous souhaitez entamer le processus de re-vérification, 
        veuillez nous contacter à l'adresse suivante : <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Cet email a été envoyé automatiquement suite à une action administrative sur votre compte.
    </p>
</div>
@endsection