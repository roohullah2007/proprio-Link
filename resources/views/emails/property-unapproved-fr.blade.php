@extends('emails.layout')

@section('content')
<div class="content">
    <h1>L'approbation de votre annonce a été retirée</h1>
    
    <p>Bonjour {{ $ownerName }},</p>
    
    <p>Nous souhaitons vous informer que votre annonce immobilière a été temporairement retirée de la visibilité publique sur notre plateforme. Votre annonce n'est plus consultable par les acheteurs potentiels.</p>
    
    <div class="property-details">
        <h3>Détails de la propriété :</h3>
        <p><strong>Adresse :</strong> {{ $property->adresse_complete }}</p>
        <p><strong>Ville :</strong> {{ $property->ville }}</p>
        <p><strong>Type de propriété :</strong> {{ $property->type_propriete }}</p>
        <p><strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    </div>
    
    @if($unapprovalReason)
    <div class="reason">
        <h3>Raison du retrait d'approbation :</h3>
        <p>{{ $unapprovalReason }}</p>
    </div>
    @endif
    
    <p>Pour remettre votre annonce en ligne, vous devrez peut-être effectuer les modifications demandées et soumettre à nouveau votre propriété pour examen.</p>
    
    <p>Si vous avez des questions ou avez besoin de clarifications, n'hésitez pas à contacter notre équipe de support.</p>
    
    <p>Cordialement,<br>L'équipe Proprio Link</p>
</div>
@endsection