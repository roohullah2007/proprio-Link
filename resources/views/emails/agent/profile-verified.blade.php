@extends('emails.layout')

@section('subject', 'Profil agent vérifié avec succès !')

@section('content')
    <div class="greeting">
        Félicitations {{ $agent->prenom }} {{ $agent->nom }} !
    </div>

    <div class="success-badge">
        🎉 Votre profil agent a été vérifié avec succès !
    </div>

    <div class="message">
        Nous avons le plaisir de vous informer que votre profil d'agent immobilier a été vérifié et approuvé par notre équipe administrative.
    </div>

    <div class="highlight-box">
        <h3>🚀 Vous pouvez maintenant :</h3>
        ✅ Accéder à toutes les propriétés de la plateforme<br>
        ✅ Acheter les contacts des propriétaires<br>
        ✅ Télécharger vos factures<br>
        ✅ Bénéficier du support prioritaire<br>
        ✅ Recevoir les nouvelles annonces en avant-première
    </div>

    <a href="{{ url('/agent/dashboard') }}" class="button">
        Accéder à mon espace agent
    </a>

    <div class="message">
        <strong>Votre profil vérifié comprend :</strong><br>
        👤 Nom: {{ $agent->prenom }} {{ $agent->nom }}<br>
        📧 Email: {{ $agent->email }}<br>
        📱 Téléphone: {{ $agent->telephone ?? 'Non renseigné' }}<br>
        🏢 SIRET: {{ $agent->numero_siret ?? 'Non renseigné' }}
    </div>

    <div class="highlight-box">
        <h3>💼 Prêt à développer votre activité ?</h3>
        <p>Explorez notre catalogue de propriétés et commencez à développer votre portefeuille client dès aujourd'hui !</p>
        
        <a href="{{ url('/agent/properties') }}" class="button">
            Parcourir les propriétés
        </a>
    </div>

    <div class="message">
        Si vous avez des questions sur l'utilisation de la plateforme ou besoin d'assistance, notre équipe support est là pour vous aider.
    </div>

    <div class="message">
        <strong>Besoin d'aide ?</strong><br>
        📧 Email: support@propio.com<br>
        📚 Guide agent: <a href="{{ url('/help/agent-guide') }}">Consulter le guide</a>
    </div>
@endsection
