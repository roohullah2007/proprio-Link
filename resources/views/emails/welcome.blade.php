@extends('emails.layout')

@section('subject', 'Bienvenue sur Proprio Link !')

@section('content')
    <div class="greeting">
        Bienvenue {{ $user->prenom }} {{ $user->nom }} !
    </div>

    <div class="success-badge">
        🎉 Votre compte {{ ucfirst(strtolower($user->type_utilisateur)) }} a été créé avec succès !
    </div>

    <div class="message">
        Nous sommes ravis de vous accueillir sur Proprio Link, la plateforme immobilière professionnelle qui connecte 
        les propriétaires et les agents immobiliers de manière efficace et sécurisée.
    </div>

    @if($user->type_utilisateur === 'AGENT')
        <div class="highlight-box">
            <h3>🏡 En tant qu'agent, vous pouvez :</h3>
            ✅ Rechercher des propriétés exclusives<br>
            ✅ Acheter les contacts des propriétaires<br>
            ✅ Développer votre portefeuille client<br>
            ✅ Accéder à des opportunités uniques<br>
            ✅ Gérer vos factures et transactions
        </div>

        <div class="warning-badge">
            ⏳ Votre profil est en cours de vérification
        </div>

        <div class="message">
            <strong>Prochaines étapes :</strong><br>
            1. Complétez votre profil avec vos informations professionnelles<br>
            2. Attendez la vérification de votre profil par notre équipe<br>
            3. Commencez à explorer les propriétés disponibles<br>
            4. Développez votre activité avec de nouveaux clients
        </div>

        <a href="{{ url('/agent/dashboard') }}" class="button">
            Accéder à mon espace agent
        </a>

    @elseif($user->type_utilisateur === 'PROPRIETAIRE')
        <div class="highlight-box">
            <h3>🏠 En tant que propriétaire, vous pouvez :</h3>
            ✅ Mettre en ligne vos propriétés<br>
            ✅ Être contacté par des agents qualifiés<br>
            ✅ Contrôler le nombre de contacts<br>
            ✅ Gérer vos annonces facilement<br>
            ✅ Suivre les statistiques de vos biens
        </div>

        <div class="message">
            <strong>Prochaines étapes :</strong><br>
            1. Complétez votre profil<br>
            2. Ajoutez votre première propriété<br>
            3. Attendez l'approbation de notre équipe<br>
            4. Recevez des contacts d'agents intéressés
        </div>

        <a href="{{ url('/properties/create') }}" class="button">
            Ajouter ma première propriété
        </a>
    @endif

    <div class="highlight-box">
        <h3>📋 Informations de votre compte :</h3>
        <strong>Email :</strong> {{ $user->email }}<br>
        <strong>Type de compte :</strong> {{ ucfirst(strtolower($user->type_utilisateur)) }}<br>
        <strong>Date d'inscription :</strong> {{ $user->created_at->format('d/m/Y à H:i') }}<br>
        <strong>Statut :</strong> {{ $user->est_verifie ? 'Vérifié' : 'En attente de vérification' }}
    </div>

    <div class="message">
        <strong>Besoin d'aide pour démarrer ?</strong><br>
        📧 Support : support@propio.com<br>
        📚 Guide d'utilisation : <a href="{{ url('/help') }}">Consulter l'aide</a><br>
        💬 Questions fréquentes : <a href="{{ url('/faq') }}">Voir la FAQ</a>
    </div>

    <div class="message">
        Si vous avez des questions ou besoin d'assistance, notre équipe support est disponible pour vous aider 
        à tirer le meilleur parti de la plateforme.
    </div>
@endsection
