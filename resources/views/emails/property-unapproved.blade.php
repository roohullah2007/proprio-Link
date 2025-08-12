@extends('emails.layout')

@section('content')
<div class="content">
    <h1>{{ __('Your property listing has been unapproved') }}</h1>
    
    <p>{{ __('Hello') }} {{ $ownerName }},</p>
    
    <p>{{ __('We want to inform you that your property listing has been temporarily removed from public visibility on our platform. Your listing is no longer searchable by potential buyers.') }}</p>
    
    <div class="property-details">
        <h3>{{ __('Property Details') }}:</h3>
        <p><strong>{{ __('Address') }}:</strong> {{ $property->adresse_complete }}</p>
        <p><strong>{{ __('City') }}:</strong> {{ $property->ville }}</p>
        <p><strong>{{ __('Property Type') }}:</strong> {{ $property->type_propriete }}</p>
        <p><strong>{{ __('Price') }}:</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    </div>
    
    @if($unapprovalReason)
    <div class="reason">
        <h3>{{ __('Reason for unapproval') }}:</h3>
        <p>{{ $unapprovalReason }}</p>
    </div>
    @endif
    
    <p>{{ __('To get your property listing back online, you may need to make the requested changes and resubmit your property for review.') }}</p>
    
    <p>{{ __('If you have any questions or need clarification, please contact our support team.') }}</p>
    
    <p>{{ __('Best regards') }},<br>{{ __('The Proprio Link Team') }}</p>
</div>
@endsection