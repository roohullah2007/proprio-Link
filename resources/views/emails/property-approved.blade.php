@extends('emails.layout')

@section('content')
<h2>🎉 Félicitations {{ $ownerName }} !</h2>

<div class="alert alert-success">
    <strong>Excellente nouvelle !</strong> Votre propriété a été approuvée et est maintenant visible en ligne.
</div>

<p>Nous avons le plaisir de vous annoncer que votre propriété a passé avec succès notre processus de modération et est désormais publiée sur la plateforme Proprio Link.</p>

<div class="property-details">
    <h3>📍 Détails de votre propriété</h3>
    <p><strong>Adresse :</strong> {{ $property->adresse_complete }}</p>
    <p><strong>Ville :</strong> {{ $property->ville }}, {{ $property->pays }}</p>
    <p><strong>Type :</strong> {{ $property->type_propriete }}</p>
    <p><strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    <p><strong>Superficie :</strong> {{ $property->superficie_m2 }} m²</p>
    <p><strong>Contacts souhaités :</strong> {{ $property->contacts_souhaites }}</p>
</div>

<h3>🚀 Prochaines étapes</h3>
<p>Votre propriété est maintenant visible par tous les agents immobiliers professionnels de notre plateforme. Voici ce qui va se passer :</p>

<ul>
    <li><strong>Visibilité immédiate :</strong> Votre annonce apparaît dans les résultats de recherche</li>
    <li><strong>Contacts d'agents :</strong> Les agents intéressés pourront acheter vos coordonnées pour {{ $property->contacts_souhaites }} contacts maximum</li>
    <li><strong>Notifications :</strong> Vous recevrez un email à chaque fois qu'un agent achète vos coordonnées</li>
    <li><strong>Suivi en temps réel :</strong> Consultez votre tableau de bord pour suivre l'activité</li>
</ul>

<a href="{{ config('app.url') }}/dashboard" class="button">
    📊 Voir mon tableau de bord
</a>

<h3>💡 Conseils pour maximiser vos chances</h3>
<p><strong>Optimisez votre annonce :</strong></p>
<ul>
    <li>Assurez-vous que vos photos mettent bien en valeur votre propriété</li>
    <li>Restez facilement joignable aux coordonnées que vous avez fournies</li>
    <li>Préparez-vous à recevoir des appels d'agents qualifiés</li>
    <li>N'hésitez pas à poser des questions aux agents qui vous contactent</li>
</ul>

<div class="alert alert-warning">
    <strong>Important :</strong> Les agents qui vous contacteront ont payé 15€ pour accéder à vos coordonnées. 
    Ils sont donc sérieusement intéressés par votre propriété !
</div>

<p>Nous vous souhaitons une vente rapide et dans les meilleures conditions.</p>

<p>
    Cordialement,<br>
    <strong>L'équipe Proprio Link</strong>
</p>

<hr style="margin: 30px 0; border: none; height: 1px; background-color: #eee;">

<p style="font-size: 14px; color: #666;">
    <strong>Besoin d'aide ?</strong><br>
    Notre équipe support est disponible pour répondre à toutes vos questions :<br>
    📧 Contactez-nous via le site web<br>
    📞 01 23 45 67 89 (du lundi au vendredi, 9h-18h)
</p>
@endsection
