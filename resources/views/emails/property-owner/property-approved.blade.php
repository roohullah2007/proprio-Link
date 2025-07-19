@extends('emails.layout')

@section('subject', 'Excellente nouvelle ! Votre propriété est approuvée')

@section('content')
    <div class="greeting">
        Excellente nouvelle {{ $property->proprietaire->prenom }} {{ $property->proprietaire->nom }} !
    </div>

    <div class="success-badge">
        🎉 Votre propriété a été approuvée et est maintenant en ligne !
    </div>

    <div class="message">
        Nous avons le plaisir de vous informer que votre propriété a passé avec succès notre processus de vérification 
        et est désormais visible par tous les agents immobiliers de notre plateforme.
    </div>

    <div class="property-card">
        <div class="property-title">
            {{ $property->type_propriete }} - {{ $property->ville }}
        </div>
        <div class="property-details">
            📍 {{ $property->adresse_complete }}<br>
            🏠 {{ $property->superficie_m2 }} m²<br>
            💰 {{ number_format($property->prix, 0, ',', ' ') }} €<br>
            ✅ Approuvée le {{ now()->format('d/m/Y à H:i') }}
        </div>
    </div>

    <div class="highlight-box">
        <h3>🚀 Votre propriété est maintenant :</h3>
        ✅ Visible par {{ \App\Models\User::where('type_utilisateur', 'AGENT')->where('est_verifie', true)->count() }}+ agents vérifiés<br>
        ✅ Incluse dans les résultats de recherche<br>
        ✅ Accessible pour l'achat de contact<br>
        ✅ Optimisée pour attirer les bons prospects
    </div>

    <a href="{{ url('/properties/' . $property->id) }}" class="button">
        Voir mon annonce en ligne
    </a>

    <div class="message">
        <strong>Gestion de votre annonce :</strong><br>
        📊 <a href="{{ url('/dashboard') }}">Tableau de bord</a> - Suivez les statistiques de votre annonce<br>
        📈 Contacts restants : {{ $property->contacts_restants }}/{{ $property->contacts_souhaites }}<br>
        📝 <a href="{{ url('/properties/' . $property->id . '/edit') }}">Modifier votre annonce</a> si nécessaire
    </div>

    <div class="highlight-box">
        <h3>📞 Que se passe-t-il maintenant ?</h3>
        <p><strong>Les agents intéressés vont :</strong></p>
        1. Découvrir votre propriété dans leurs recherches<br>
        2. Acheter vos coordonnées s'ils ont un client intéressé<br>
        3. Vous contacter directement pour organiser des visites<br>
        4. Vous accompagner dans la vente avec leurs clients
    </div>

    <div class="message">
        <strong>Conseils pour maximiser vos chances de vente :</strong><br>
        📱 Restez disponible pour les appels des agents<br>
        🏠 Préparez votre bien pour les visites<br>
        📋 Rassemblez tous les documents nécessaires<br>
        💬 Soyez ouvert aux négociations constructives
    </div>

    <div class="highlight-box">
        <h3>💡 Besoin d'aide pour optimiser votre annonce ?</h3>
        <p>Notre équipe peut vous conseiller pour améliorer l'attractivité de votre propriété :</p>
        
        📧 Email : support@propio.com<br>
        📞 Téléphone : 01 23 45 67 89<br>
        📚 <a href="{{ url('/help/owner-guide') }}">Guide du propriétaire</a>
    </div>

    <div class="message">
        <strong>Référence :</strong> #{{ substr($property->id, 0, 8) }}<br>
        <strong>Lien public :</strong> <a href="{{ url('/properties/' . $property->id) }}">{{ url('/properties/' . $property->id) }}</a>
    </div>

    <div class="message">
        Merci de votre confiance et bonne vente avec Propio !
    </div>
@endsection
