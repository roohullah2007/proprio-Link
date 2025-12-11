@extends('emails.layout-blue')

@section('content')
<div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Demande de modification
    </h1>
    <p style="color: #6B7280; font-size: 16px; margin: 0;">
        Des modifications sont requises pour votre propriété
    </p>
</div>

<div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
    <p style="color: #92400E; font-size: 14px; margin: 0;">
        <strong>Action requise :</strong> L'administrateur a demandé des modifications pour votre annonce.
    </p>
</div>

<div style="margin-bottom: 20px;">
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Bonjour {{ $property->proprietaire->prenom }},
    </p>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Notre équipe de modération a examiné votre annonce et vous demande d'apporter quelques modifications.
    </p>
    
    <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #4B5563; font-size: 14px; margin: 0 0 10px 0;">
            <strong>Propriété concernée :</strong><br>
            {{ $property->adresse_complete }}
        </p>
    </div>
    
    <div style="background-color: #FFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1F2937; font-size: 16px; margin: 0 0 15px 0;">Modifications demandées :</h3>
        <p style="color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">{{ $editRequest->requested_changes }}</p>
    </div>
    
    @if($editRequest->admin_notes)
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
        <h3 style="color: #1E40AF; font-size: 14px; margin: 0 0 10px 0;">Notes supplémentaires :</h3>
        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">{{ $editRequest->admin_notes }}</p>
    </div>
    @endif
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Veuillez examiner et effectuer les modifications nécessaires à votre annonce. 
        Une fois les modifications apportées, votre propriété sera à nouveau examinée par notre équipe.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ $propertyUrl }}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
            Modifier ma propriété
        </a>
    </div>
    
    <p style="color: #374151; font-size: 14px; line-height: 1.6;">
        Si vous avez besoin d'aide ou avez des questions concernant ces modifications, 
        n'hésitez pas à contacter notre équipe support : 
        <a href="mailto:support@proprio-link.fr" style="color: #3B82F6; text-decoration: none;">support@proprio-link.fr</a>
    </p>
</div>

<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
    <p style="color: #6B7280; font-size: 12px; text-align: center;">
        Merci de votre coopération pour maintenir la qualité de notre plateforme.
    </p>
</div>
@endsection
