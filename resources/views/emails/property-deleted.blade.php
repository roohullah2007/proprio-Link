@extends('emails.layout')

@section('content')
<div class="content">
    <h1>{{ __('Your property listing has been removed') }}</h1>
    
    <p>{{ __('Hello') }} {{ $ownerName }},</p>
    
    <p>{{ __('We want to inform you that your property listing has been permanently removed from our platform.') }}</p>
    
    <div class="property-details">
        <h3>{{ __('Property Details') }}:</h3>
        <p><strong>{{ __('Address') }}:</strong> {{ $property->adresse_complete }}</p>
        <p><strong>{{ __('City') }}:</strong> {{ $property->ville }}</p>
        <p><strong>{{ __('Property Type') }}:</strong> {{ $property->type_propriete }}</p>
        <p><strong>{{ __('Price') }}:</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    </div>
    
    @if($deletionReason)
    <div class="reason">
        <h3>{{ __('Reason for removal') }}:</h3>
        <p>{{ $deletionReason }}</p>
    </div>
    @endif
    
    <p>{{ __('If you believe this removal was made in error, please contact our support team for assistance.') }}</p>
    
    <p>{{ __('Best regards') }},<br>{{ __('The Proprio Link Team') }}</p>
</div>
@endsection