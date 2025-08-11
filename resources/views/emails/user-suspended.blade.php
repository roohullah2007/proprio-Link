@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Compte suspendu
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Votre compte a été temporairement suspendu
    </p>
</div>

<div style="background-color: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #DC2626; font-size: 14px; margin: 0;">
        <strong>Important :</strong> Votre compte {{ $user->email }} a été suspendu par notre équipe de modération.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $user->prenom ?? $user->first_name }} {{ $user->nom ?? $user->last_name }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous vous informons que votre compte Proprio Link a été temporairement suspendu.
    </p>
    
    @if($reason)
    <div style="background-color: #F3F4F6; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
        <p style="color: #4B5563; font-size: 14px; margin: 0;">
            <strong>Raison de la suspension :</strong><br>
            {{ $reason }}
        </p>
    </div>
    @endif
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Pendant cette suspension :
    </p>
    
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        <li>Vous ne pourrez pas vous connecter à votre compte</li>
        <li>Vos annonces ne seront pas visibles sur le site</li>
        <li>Vous ne pourrez pas effectuer d'achats de contacts</li>
    </ul>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez discuter de cette décision, 
        veuillez nous contacter à l'adresse suivante : <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Cet email a été envoyé automatiquement suite à une action administrative sur votre compte.
    </p>
</div>
@endsection