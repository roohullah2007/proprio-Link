@extends('emails.layout')

@section('content')
<h2>✅ Votre propriété a été soumise avec succès</h2>

<p>Bonjour {{ $ownerName }},</p>

<p>Nous vous remercions d'avoir choisi Proprio Link pour vendre votre propriété ! Votre soumission a bien été reçue et est maintenant en cours d'examen par notre équipe.</p>

<div class="alert alert-success">
    <strong>🎯 Soumission confirmée !</strong> Votre propriété sera examinée dans les 24-48h ouvrables.
</div>

<div class="property-details">
    <h3>📍 Récapitulatif de votre soumission</h3>
    <p><strong>Adresse :</strong> {{ $property->adresse_complete }}</p>
    <p><strong>Ville :</strong> {{ $property->ville }}, {{ $property->pays }}</p>
    <p><strong>Type :</strong> {{ $property->type_propriete }}</p>
    <p><strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    <p><strong>Superficie :</strong> {{ $property->superficie_m2 }} m²</p>
    <p><strong>Contacts souhaités :</strong> {{ $property->contacts_souhaites }}</p>
    <p><strong>Date de soumission :</strong> {{ $property->created_at->format('d/m/Y à H:i') }}</p>
</div>

<h3>⏱️ Que se passe-t-il maintenant ?</h3>
<ol>
    <li><strong>Examen de votre dossier</strong> - Notre équipe vérifie la conformité de votre annonce (24-48h)</li>
    <li><strong>Validation des informations</strong> - Vérification de l'adresse, du prix et des photos</li>
    <li><strong>Publication en ligne</strong> - Une fois approuvée, votre propriété sera visible par tous les agents</li>
    <li><strong>Notification de publication</strong> - Vous recevrez un email de confirmation</li>
</ol>

<h3>📊 Pendant l'attente</h3>
<p>Vous pouvez dès maintenant :</p>
<ul>
    <li>Suivre le statut de votre soumission dans votre tableau de bord</li>
    <li>Préparer vos disponibilités pour recevoir les contacts d'agents</li>
    <li>Consulter nos conseils pour optimiser vos chances de vente</li>
</ul>

<a href="{{ config('app.url') }}/dashboard" class="button">
    📊 Accéder à mon tableau de bord
</a>

<h3>🔍 Critères d'approbation</h3>
<p>Pour être approuvée, votre propriété doit respecter nos critères de qualité :</p>
<ul>
    <li><strong>Photos de qualité :</strong> Images nettes et représentatives de la propriété</li>
    <li><strong>Informations exactes :</strong> Prix réaliste, adresse précise, description complète</li>
    <li><strong>Conformité légale :</strong> Respect des règlementations immobilières françaises</li>
    <li><strong>Propriété authentique :</strong> Vérification que vous êtes bien le propriétaire</li>
</ul>

<div class="alert alert-warning">
    <strong>💡 Important :</strong> Si des informations manquent ou semblent incorrectes, 
    nous vous contacterons pour demander des clarifications avant d'approuver votre annonce.
</div>

<h3>🎯 Une fois votre propriété publiée</h3>
<p>Votre propriété sera visible par plus de <strong>10 000+ agents immobiliers professionnels</strong> actifs sur notre plateforme. Chaque agent intéressé pourra acheter vos coordonnées pour <strong>15€</strong>, garantissant leur sérieux et leur motivation.</p>

<p>Vous recevrez une notification email à chaque fois qu'un agent achète vos coordonnées, avec toutes les informations pour le contacter.</p>

<h3>❓ Questions fréquentes</h3>
<p><strong>Combien de temps pour recevoir le premier contact ?</strong><br>
En moyenne, nos propriétaires reçoivent leur premier contact d'agent dans les 3-7 jours suivant la publication.</p>

<p><strong>Que faire si je ne reçois pas de contacts ?</strong><br>
Notre équipe peut vous aider à optimiser votre annonce. Contactez-nous via le site web</p>

<p><strong>Puis-je modifier ma propriété après soumission ?</strong><br>
Tant qu'elle n'est pas publiée, vous pouvez modifier toutes les informations depuis votre tableau de bord.</p>

<h3>🤝 Support disponible</h3>
<p>Notre équipe est là pour vous accompagner :</p>
<ul>
    <li>📧 Email : Contactez-nous via le site web</li>
    <li>📞 Téléphone : 01 23 45 67 89 (9h-18h, lun-ven)</li>
    <li>💬 Chat en ligne : Depuis votre tableau de bord</li>
</ul>

<p>Nous vous souhaitons une vente rapide et dans les meilleures conditions !</p>

<p>
    Cordialement,<br>
    <strong>L'équipe Proprio Link</strong>
</p>

<hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;">

<p style="font-size: 14px; color: #666;">
    <strong>Proprio Link en chiffres :</strong><br>
    🏠 Plus de 50 000 propriétés vendues<br>
    👥 Plus de 10 000 agents professionnels actifs<br>
    ⭐ 4.8/5 de satisfaction client<br>
    💰 Commission 0% pour les propriétaires
</p>
@endsection
