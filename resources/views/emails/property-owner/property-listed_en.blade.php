@extends('emails.layout')

@section('subject', 'Property Listed Successfully - Under Review')

@section('content')
    <div class="greeting">
        Hello {{ $property->proprietaire->prenom }} {{ $property->proprietaire->nom }},
    </div>

    <div class="message">
        Thank you for choosing Proprio Link to list your property.
    </div>

    <div class="warning-badge">
        ⏳ Your property is under review
    </div>

    <div class="property-card">
        <div class="property-title">
            {{ $property->type_propriete }} - {{ $property->ville }}
        </div>
        <div class="property-details">
            📍 {{ $property->adresse_complete }}<br>
            🏠 {{ $property->superficie_m2 }} m²<br>
            💰 {{ number_format($property->prix, 0, ',', ' ') }} €<br>
            📅 Listed on {{ $property->created_at->format('m/d/Y \a\t g:i A') }}
        </div>
    </div>

    <div class="highlight-box">
        <h3>📋 Review Process:</h3>
        1. <strong>Information Verification</strong> - Our team verifies your property details<br>
        2. <strong>Photo Validation</strong> - We ensure image quality meets our standards<br>
        3. <strong>Compliance Check</strong> - Verification of prices and descriptions<br>
        4. <strong>Publication</strong> - Your listing will be visible to agents
    </div>

    <div class="message">
        <strong>Processing Time:</strong> The review process typically takes 24-48 business hours. 
        You will receive a confirmation email as soon as your property is approved and visible on the platform.
    </div>

    <div class="highlight-box">
        <h3>🎯 During the review, you can:</h3>
        ✏️ <a href="{{ url('/properties/' . $property->id . '/edit') }}">Edit your listing details</a><br>
        📸 Add or modify photos<br>
        📝 Complete the description if necessary<br>
        👀 <a href="{{ url('/properties/' . $property->id) }}">Preview your listing</a>
    </div>

    <a href="{{ url('/properties') }}" class="button">
        Manage My Properties
    </a>

    <div class="message">
        <strong>Your property reference:</strong> #{{ substr($property->id, 0, 8) }}<br>
        <strong>Desired contacts:</strong> {{ $property->contacts_souhaites }} agents maximum
    </div>

    <div class="highlight-box">
        <h3>💡 Tips to optimize your listing:</h3>
        • Add multiple high-quality photos<br>
        • Write a detailed and attractive description<br>
        • Mention amenities and features<br>
        • Include practical information (transportation, shops)
    </div>

    <div class="message">
        If you have any questions about the review process, please don't hesitate to contact us.
    </div>
@endsection