@extends('emails.layout')

@section('subject', 'Reçu d\'achat - Détails du contact propriétaire')

@section('content')
    <div class="greeting">
        Bonjour {{ $purchase->agent->prenom }} {{ $purchase->agent->nom }},
    </div>

    <div class="message">
        Voici le reçu de votre achat de contact propriétaire. La transaction a été confirmée avec succès.
    </div>

    <div class="success-badge">
        🧾 REÇU D'ACHAT - {{ number_format($purchase->montant_paye, 2, ',', ' ') }} {{ $purchase->devise }}
    </div>

    <div class="property-card">
        <div class="property-title">
            {{ $purchase->property->type_propriete ?? 'Propriété' }} - {{ $purchase->property->ville ?? 'N/A' }}
        </div>
        <div class="property-details">
            📍 {{ $purchase->property->adresse_complete ?? 'Adresse non disponible' }}<br>
            🏠 {{ $purchase->property->superficie_m2 ?? 'N/A' }} m²
            @if($purchase->property->prix)
            <div class="price">{{ number_format($purchase->property->prix, 0, ',', ' ') }} €</div>
            @endif
        </div>
    </div>

    <div class="highlight-box">
        <h3>📞 Informations de contact du propriétaire :</h3>
        @if(!empty($contactData))
            <strong>{{ $contactData['prenom'] ?? '' }} {{ $contactData['nom'] ?? '' }}</strong><br>
            📧 Email: <a href="mailto:{{ $contactData['email'] ?? '' }}">{{ $contactData['email'] ?? '' }}</a><br>
            📱 Téléphone: <a href="tel:{{ $contactData['telephone'] ?? '' }}">{{ $contactData['telephone'] ?? '' }}</a>
        @else
            Les informations de contact seront disponibles dans votre espace agent.
        @endif
    </div>

    <div class="message">
        <strong>Facture :</strong> Votre facture est jointe à cet email en format PDF. 
        Vous pouvez également la télécharger depuis votre espace agent.
    </div>

    <a href="{{ url('/agent/invoices') }}" class="button">
        Voir mes factures
    </a>

    <div class="message">
        <strong>Prochaines étapes :</strong><br>
        1. Contactez le propriétaire aux coordonnées ci-dessus<br>
        2. Organisez une visite de la propriété<br>
        3. Négociez les conditions de vente<br>
        4. Accompagnez votre client dans la transaction
    </div>

    <div class="highlight-box">
        <h3>💡 Conseils pour une prise de contact réussie :</h3>
        • Présentez-vous comme agent immobilier professionnel<br>
        • Mentionnez que vous avez un client intéressé par sa propriété<br>
        • Proposez une visite à un moment qui lui convient<br>
        • Soyez courtois et professionnel dans vos échanges
    </div>

    <div class="highlight-box">
        <h3>📋 Détails de la transaction (reçu) :</h3>
        <strong>ID de transaction :</strong> {{ $purchase->stripe_payment_intent_id }}<br>
        <strong>Date d'achat :</strong> {{ $purchase->paiement_confirme_a ? $purchase->paiement_confirme_a->format('d/m/Y à H:i') : 'N/A' }}<br>
        <strong>Montant payé :</strong> {{ number_format($purchase->montant_paye, 2, ',', ' ') }} {{ $purchase->devise }}<br>
        <strong>Mode de paiement :</strong> Carte de crédit via Stripe<br>
        <strong>Statut :</strong> ✅ Payé et confirmé
    </div>
@endsection
