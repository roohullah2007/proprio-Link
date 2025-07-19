@component('mail::message')
# {{ __('Edit Request for Your Property') }}

{{ __('Hello') }} {{ $property->proprietaire->prenom }},

{{ __('An administrator has requested some edits to your property listing:') }}

**{{ __('Property Address') }}:** {{ $property->adresse_complete }}

## {{ __('Requested Changes') }}
{{ $editRequest->requested_changes }}

@if($editRequest->admin_notes)
## {{ __('Additional Notes') }}
{{ $editRequest->admin_notes }}
@endif

{{ __('Please review and make the necessary changes to your property listing. You can access your property by clicking the button below:') }}

@component('mail::button', ['url' => $propertyUrl])
{{ __('View Property') }}
@endcomponent

{{ __('If you need assistance or have questions about these changes, please contact our support team.') }}

{{ __('Thank you') }},<br>
{{ config('app.name') }} {{ __('Team') }}
@endcomponent
