@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Félicitations ! Votre profil agent est vérifié
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Notre équipe a vérifié votre compte agent
    </p>
</div>

<div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #16A34A; font-size: 14px; margin: 0;">
        <strong>Excellent !</strong> Votre compte agent a été vérifié par notre équipe.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $agent->prenom }} {{ $agent->nom }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous sommes heureux de vous confirmer que votre profil agent a été vérifié avec succès par notre équipe de modération.
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        En tant qu'agent vérifié, vous bénéficiez maintenant de :
    </p>
    
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        <li>Un badge de vérification sur votre profil</li>
        <li>Une visibilité accrue de vos annonces</li>
        <li>La confiance renforcée des propriétaires et acheteurs</li>
        <li>L'accès complet à toutes les fonctionnalités premium</li>
    </ul>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
        <p style="color: #1E40AF; font-size: 14px; margin: 0;">
            <strong>Votre profil vérifié :</strong><br>
            Nom : {{ $agent->prenom }} {{ $agent->nom }}<br>
            Email : {{ $agent->email }}<br>
            Téléphone : {{ $agent->telephone ?? 'Non renseigné' }}<br>
            SIRET : {{ $agent->numero_siret ?? 'Non renseigné' }}
        </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ url('/agent/dashboard') }}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
            Accéder à mon tableau de bord
        </a>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous avez des questions, notre équipe support est à votre disposition : 
        <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Merci de faire confiance à Proprio Link pour développer votre activité immobilière !
    </p>
</div>
@endsection
