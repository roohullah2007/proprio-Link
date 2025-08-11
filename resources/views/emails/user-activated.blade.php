@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Compte réactivé
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Votre compte a été réactivé avec succès
    </p>
</div>

<div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #16A34A; font-size: 14px; margin: 0;">
        <strong>Bonne nouvelle !</strong> Votre compte {{ $user->email }} a été réactivé.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $user->prenom }} {{ $user->nom }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Nous sommes heureux de vous informer que votre compte Proprio Link a été réactivé.
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Vous pouvez maintenant :
    </p>
    
    <ul style="color: #374151; font-size: 14px; line-height: 1.8; margin-left: 20px;">
        <li>Vous connecter à votre compte</li>
        <li>Publier et gérer vos annonces</li>
        <li>Acheter des contacts propriétaires</li>
        <li>Accéder à toutes les fonctionnalités du site</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ url('/login') }}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
            Se connecter maintenant
        </a>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante : 
        <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Nous sommes ravis de vous retrouver sur Proprio Link !
    </p>
</div>
@endsection