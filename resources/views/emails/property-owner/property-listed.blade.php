@extends('emails.layout')

@section('subject', 'Propriété mise en ligne - En cours de vérification')

@section('content')
    <div class="greeting">
        Bonjour {{ $property->proprietaire->prenom }} {{ $property->proprietaire->nom }},
    </div>

    <div class="message">
        Nous vous remercions d'avoir choisi Proprio Link pour la mise en ligne de votre propriété.
    </div>

    <div class="warning-badge">
        ⏳ Votre propriété est en cours de vérification
    </div>

    <div class="property-card">
        <div class="property-title">
            {{ $property->type_propriete }} - {{ $property->ville }}
        </div>
        <div class="property-details">
            📍 {{ $property->adresse_complete }}<br>
            🏠 {{ $property->superficie_m2 }} m²<br>
            💰 {{ number_format($property->prix, 0, ',', ' ') }} €<br>
            📅 Mise en ligne le {{ $property->created_at->format('d/m/Y à H:i') }}
        </div>
    </div>

    <div class="highlight-box">
        <h3>📋 Processus de vérification :</h3>
        1. <strong>Vérification des informations</strong> - Notre équipe vérifie les détails de votre propriété<br>
        2. <strong>Validation des photos</strong> - Nous nous assurons de la qualité des images<br>
        3. <strong>Contrôle de conformité</strong> - Vérification des prix et descriptions<br>
        4. <strong>Publication</strong> - Votre annonce sera visible par les agents
    </div>

    <div class="message">
        <strong>Délai de traitement :</strong> La vérification prend généralement entre 24h et 48h ouvrées. 
        Vous recevrez un email de confirmation dès que votre propriété sera approuvée et visible sur la plateforme.
    </div>

    <div class="highlight-box">
        <h3>🎯 Pendant la vérification, vous pouvez :</h3>
        ✏️ <a href="{{ url('/properties/' . $property->id . '/edit') }}">Modifier les détails de votre annonce</a><br>
        📸 Ajouter ou modifier les photos<br>
        📝 Compléter la description si nécessaire<br>
        👀 <a href="{{ url('/properties/' . $property->id) }}">Prévisualiser votre annonce</a>
    </div>

    <a href="{{ url('/properties') }}" class="button">
        Gérer mes propriétés
    </a>

    <div class="message">
        <strong>Référence de votre propriété :</strong> #{{ substr($property->id, 0, 8) }}<br>
        <strong>Contacts souhaités :</strong> {{ $property->contacts_souhaites }} agents maximum
    </div>

    <div class="highlight-box">
        <h3>💡 Conseils pour optimiser votre annonce :</h3>
        • Ajoutez plusieurs photos de qualité<br>
        • Rédigez une description détaillée et attractive<br>
        • Mentionnez les équipements et commodités<br>
        • Indiquez les informations pratiques (transports, commerces)
    </div>

    <div class="message">
        Si vous avez des questions concernant le processus de vérification, n'hésitez pas à nous contacter.
    </div>
@endsection
