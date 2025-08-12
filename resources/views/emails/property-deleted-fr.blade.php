@extends('emails.layout')

@section('content')
<div class="content">
    <h1>Votre annonce immobilière a été supprimée</h1>
    
    <p>Bonjour {{ $ownerName }},</p>
    
    <p>Nous souhaitons vous informer que votre annonce immobilière a été définitivement supprimée de notre plateforme.</p>
    
    <div class="property-details">
        <h3>Détails de la propriété :</h3>
        <p><strong>Adresse :</strong> {{ $property->adresse_complete }}</p>
        <p><strong>Ville :</strong> {{ $property->ville }}</p>
        <p><strong>Type de propriété :</strong> {{ $property->type_propriete }}</p>
        <p><strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    </div>
    
    @if($deletionReason)
    <div class="reason">
        <h3>Raison de la suppression :</h3>
        <p>{{ $deletionReason }}</p>
    </div>
    @endif
    
    <p>Si vous pensez que cette suppression a été effectuée par erreur, n'hésitez pas à contacter notre équipe de support pour obtenir de l'aide.</p>
    
    <p>Cordialement,<br>L'équipe Proprio Link</p>
</div>
@endsection