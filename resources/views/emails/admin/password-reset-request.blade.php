@extends('emails.layout')

@section('subject', 'Notification Admin - Réinitialisation de mot de passe')

@section('content')
    <div class="greeting">
        Notification Administrateur
    </div>

    <div class="warning-badge">
        🔒 Demande de réinitialisation de mot de passe
    </div>

    <div class="message">
        Un utilisateur a demandé la réinitialisation de son mot de passe. Voici les détails de la demande :
    </div>

    <div class="highlight-box">
        <h3>👤 Détails de l'utilisateur</h3>
        <strong>Nom complet :</strong> {{ $user->prenom }} {{ $user->nom }}<br>
        <strong>Adresse email :</strong> {{ $user->email }}<br>
        <strong>Type d'utilisateur :</strong> {{ $user->type_utilisateur }}<br>
        <strong>Date de la demande :</strong> {{ now()->format('d/m/Y à H:i') }}
    </div>

    <div class="success-badge">
        ✅ Email de réinitialisation envoyé automatiquement
    </div>

    <div class="message">
        Un email avec un lien de réinitialisation sécurisé a été automatiquement envoyé à l'utilisateur à l'adresse {{ $user->email }}.
    </div>

    <div class="highlight-box" style="background-color: #fef3cd; border-left-color: #f59e0b;">
        <h3 style="color: #f59e0b;">🔐 Actions de sécurité recommandées</h3>
        <div style="font-size: 14px; color: #92400e;">
            • Vérifiez l'activité récente de ce compte utilisateur<br>
            • Surveillez les tentatives de connexion suspectes<br>
            • Contactez l'utilisateur si cette demande semble inhabituelle<br>
            • Le lien expire automatiquement dans 60 minutes
        </div>
    </div>

    <div class="message">
        <strong>Informations sur la réinitialisation :</strong><br>
        • Lien de réinitialisation valable 60 minutes<br>
        • Envoyé à : {{ $user->email }}<br>
        • URL de réinitialisation : {{ $resetUrl ?? 'Généré automatiquement' }}<br>
        • Demande effectuée depuis : IP non trackée
    </div>

    <div class="message">
        Cette notification a été générée automatiquement pour informer les administrateurs 
        des demandes de réinitialisation de mot de passe sur la plateforme.
    </div>
@endsection
