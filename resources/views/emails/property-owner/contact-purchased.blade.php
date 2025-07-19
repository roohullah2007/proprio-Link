@extends('emails.layout')

@section('subject', 'Bonne nouvelle ! Un agent s\'intéresse à votre propriété')

@section('content')
    <div class="greeting">
        Excellente nouvelle {{ $purchase->property->proprietaire->prenom }} {{ $purchase->property->proprietaire->nom }} !
    </div>

    <div class="success-badge">
        🎯 Un agent professionnel a acheté vos coordonnées
    </div>

    <div class="message">
        Nous avons le plaisir de vous informer qu'un agent immobilier certifié s'intéresse à votre propriété 
        et a acheté vos informations de contact.
    </div>

    <div class="property-card">
        <div class="property-title">
            {{ $purchase->property->type_propriete }} - {{ $purchase->property->ville }}
        </div>
        <div class="property-details">
            📍 {{ $purchase->property->adresse_complete }}<br>
            🏠 {{ $purchase->property->superficie_m2 }} m²<br>
            💰 {{ number_format($purchase->property->prix, 0, ',', ' ') }} €
        </div>
    </div>

    <div class="highlight-box">
        <h3>👤 Agent qui vous contactera :</h3>
        <strong>{{ $purchase->agent->prenom }} {{ $purchase->agent->nom }}</strong><br>
        📧 {{ $purchase->agent->email }}<br>
        📱 {{ $purchase->agent->telephone ?? 'Non renseigné' }}<br>
        🏢 {{ $purchase->agent->numero_siret ? 'SIRET: ' . $purchase->agent->numero_siret : 'Agent certifié' }}
    </div>

    <div class="message">
        <strong>⏰ À quoi vous attendre :</strong><br>
        Cet agent va vous contacter prochainement (généralement sous 24-48h) pour :<br>
        • Vous présenter son client potentiel<br>
        • Organiser une visite de votre propriété<br>
        • Discuter des modalités de vente<br>
        • Vous accompagner dans la transaction
    </div>

    <div class="highlight-box">
        <h3>💡 Conseils pour optimiser cette opportunité :</h3>
        📞 <strong>Restez disponible</strong> - L'agent va vous appeler bientôt<br>
        🏠 <strong>Préparez votre bien</strong> - Assurez-vous qu'il soit prêt pour les visites<br>
        📋 <strong>Rassemblez vos documents</strong> - Diagnostics, actes, etc.<br>
        💬 <strong>Soyez ouvert au dialogue</strong> - Écoutez les propositions de l'agent<br>
        🤝 <strong>Restez professionnel</strong> - Une bonne première impression est cruciale
    </div>

    <div class="message">
        <strong>Informations sur la transaction :</strong><br>
        📅 Date d'achat : {{ $purchase->paiement_confirme_a->format('d/m/Y à H:i') }}<br>
        💳 Montant payé par l'agent : {{ number_format($purchase->montant_paye, 2, ',', ' ') }} €<br>
        🆔 Référence : {{ $purchase->stripe_payment_intent_id }}
    </div>

    <div class="highlight-box">
        <h3>📊 État de votre annonce :</h3>
        Contacts restants : <strong>{{ $purchase->property->contacts_restants }}/{{ $purchase->property->contacts_souhaites }}</strong><br>
        @if($purchase->property->contacts_restants > 0)
            Votre propriété peut encore être contactée par {{ $purchase->property->contacts_restants }} agent(s) supplémentaire(s).
        @else
            Votre quota de contacts a été atteint. Vous pouvez modifier ce nombre si nécessaire.
        @endif
    </div>

    <a href="{{ url('/properties/' . $purchase->property->id) }}" class="button">
        Voir mon annonce
    </a>

    <div class="message">
        <strong>Questions ou problèmes ?</strong><br>
        Si vous rencontrez des difficultés avec cet agent ou avez des questions, 
        contactez-nous immédiatement :<br>
        📧 support@propio.com<br>
        📞 01 23 45 67 89
    </div>

    <div class="message">
        Nous vous souhaitons une excellente vente avec Propio !
    </div>
@endsection
