@extends('emails.layout')

@section('content')
<h2>🎉 Congratulations {{ $ownerName }}!</h2>

<div class="alert alert-success">
    <strong>Great news!</strong> Your property has been approved and is now live online.
</div>

<p>We are pleased to announce that your property has successfully passed our moderation process and is now published on the Proprio Link platform.</p>

<div class="property-details">
    <h3>📍 Your Property Details</h3>
    <p><strong>Address:</strong> {{ $property->adresse_complete }}</p>
    <p><strong>City:</strong> {{ $property->ville }}, {{ $property->pays }}</p>
    <p><strong>Type:</strong> {{ $property->type_propriete }}</p>
    <p><strong>Price:</strong> {{ number_format($property->prix, 0, ',', ' ') }} €</p>
    <p><strong>Surface Area:</strong> {{ $property->superficie_m2 }} m²</p>
    <p><strong>Desired Contacts:</strong> {{ $property->contacts_souhaites }}</p>
</div>

<div class="next-steps">
    <h3>📈 What Happens Next?</h3>
    <ul>
        <li><strong>Visibility:</strong> Your property is now visible to qualified real estate agents</li>
        <li><strong>Contact Requests:</strong> Agents can purchase your contact information to reach out</li>
        <li><strong>Notifications:</strong> You'll receive email alerts when agents purchase your contact details</li>
        <li><strong>Management:</strong> You can edit your property details anytime through your dashboard</li>
    </ul>
</div>

<div class="tips">
    <h3>💡 Tips to Maximize Your Success</h3>
    <ul>
        <li>Keep your contact information up to date</li>
        <li>Add high-quality photos to attract more agents</li>
        <li>Update your property description with detailed features</li>
        <li>Respond promptly to agent inquiries</li>
    </ul>
</div>

<div class="cta">
    <a href="{{ url('/properties/' . $property->id) }}" class="button button-primary">
        View Your Live Property
    </a>
    
    <a href="{{ url('/properties') }}" class="button">
        Manage All Properties
    </a>
</div>

<div class="stats">
    <h3>📊 Your Property Stats</h3>
    <p><strong>Listed on:</strong> {{ $property->created_at->format('F j, Y') }}</p>
    <p><strong>Approved on:</strong> {{ now()->format('F j, Y') }}</p>
    <p><strong>Property ID:</strong> #{{ substr($property->id, 0, 8) }}</p>
</div>

<p><strong>Thank you for choosing Proprio Link!</strong> We're excited to help you connect with the right agents for your property.</p>

<div class="footer-note">
    <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
</div>
@endsection