@extends('emails.layout')

@section('content')
<h2>⚠️ Votre soumission nécessite des modifications</h2>

<p>Bonjour {{ $ownerName }},</p>

<p>Nous vous remercions d'avoir soumis votre propriété sur Propio. Après examen, notre équipe de modération a identifié quelques points qui nécessitent des corrections avant que nous puissions publier votre annonce.</p>

<div class="property-details">
    <h3>📍 Propriété concernée</h3>
    <p><strong>Adresse :</strong> {{ $property->adresse_complete }}</p>
    <p><strong>Ville :</strong> {{ $property->ville }}, {{ $property->pays }}</p>
    <p><strong>Type :</strong> {{ $property->type_propriete }}</p>
    <p><strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
</div>

<div class="alert alert-danger">
    <h3>🔍 Raisons du rejet</h3>
    <p>{{ $rejectionReason }}</p>
</div>

<h3>🛠️ Comment corriger votre soumission</h3>
<p>Pour que votre propriété soit approuvée, veuillez :</p>

<ol>
    <li><strong>Connectez-vous à votre compte</strong> sur Propio</li>
    <li><strong>Accédez à votre tableau de bord</strong> et trouvez cette propriété</li>
    <li><strong>Effectuez les corrections</strong> mentionnées ci-dessus</li>
    <li><strong>Soumettez à nouveau</strong> votre propriété pour modération</li>
</ol>

<a href="{{ config('app.url') }}/dashboard" class="button">
    ✏️ Modifier ma propriété
</a>

<h3>📋 Critères de qualité Propio</h3>
<p>Pour rappel, voici les critères que nous vérifions :</p>
<ul>
    <li><strong>Photos de qualité :</strong> Images nettes, bien éclairées, représentatives</li>
    <li><strong>Informations complètes :</strong> Adresse précise, prix réaliste, description détaillée</li>
    <li><strong>Conformité légale :</strong> Respect des règlementations immobilières</li>
    <li><strong>Authenticité :</strong> Propriété réelle, propriétaire vérifié</li>
</ul>

<div class="alert alert-warning">
    <strong>💡 Conseil :</strong> Prenez le temps de bien corriger ces points pour éviter un nouveau rejet. 
    Notre objectif est de maintenir la qualité de la plateforme pour tous nos utilisateurs.
</div>

<p>Une fois les corrections effectuées, votre propriété sera de nouveau examinée par notre équipe dans les 24-48h ouvrables.</p>

<h3>🤝 Besoin d'aide ?</h3>
<p>Si vous avez des questions sur les corrections à apporter ou si vous souhaitez des conseils pour optimiser votre annonce, n'hésitez pas à nous contacter :</p>

<ul>
    <li>📧 Email : <a href="mailto:support@propio.com">support@propio.com</a></li>
    <li>📞 Téléphone : 01 23 45 67 89 (du lundi au vendredi, 9h-18h)</li>
    <li>💬 Chat en ligne : Disponible depuis votre tableau de bord</li>
</ul>

<p>Nous restons à votre disposition pour vous accompagner dans la vente de votre propriété.</p>

<p>
    Cordialement,<br>
    <strong>L'équipe de modération Propio</strong>
</p>

<hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;">

<p style="font-size: 14px; color: #666;">
    <strong>Rappel :</strong> Propio est une plateforme qui connecte directement propriétaires et agents immobiliers. 
    En maintenant des standards de qualité élevés, nous assurons une meilleure expérience pour tous nos utilisateurs.
</p>
@endsection
