@extends('emails.layout')

@section('subject', 'Votre compte a été suspendu - Proprio Link')

@section('content')
    <div class="greeting">
        Bonjour {{ $user->first_name }} {{ $user->last_name }},
    </div>

    <div class="warning-badge">
        ⚠️ Votre compte {{ ucfirst($user->role) }} a été suspendu
    </div>

    <div class="message">
        Nous vous informons que votre compte sur Proprio Link a été temporairement suspendu par notre équipe d'administration.
    </div>

    @if($reason)
        <div class="highlight-box" style="border-left: 4px solid #dc2626; background-color: #fef2f2;">
            <h3>📋 Motif de la suspension :</h3>
            <p>{{ $reason }}</p>
        </div>
    @endif

    <div class="message">
        <strong>Conséquences de la suspension :</strong><br>
        • Vous ne pouvez plus vous connecter à votre compte<br>
        • L'accès à toutes les fonctionnalités est temporairement bloqué<br>
        @if($user->role === 'agent')
        • Vos recherches de propriétés sont suspendues<br>
        • Vous ne pouvez plus acheter de contacts<br>
        @elseif($user->role === 'owner')
        • Vos propriétés ne sont plus visibles publiquement<br>
        • Les agents ne peuvent plus vous contacter<br>
        @endif
        • Toutes vos données restent sauvegardées
    </div>

    <div class="highlight-box">
        <h3>🔄 Comment réactiver votre compte :</h3>
        1. Contactez notre équipe de support<br>
        2. Expliquez votre situation ou corrigez le problème signalé<br>
        3. Attendez la révision de votre dossier<br>
        4. Votre compte sera réactivé si les conditions sont remplies
    </div>

    <div class="message">
        <strong>Informations de votre compte :</strong><br>
        <strong>Email :</strong> {{ $user->email }}<br>
        <strong>Type de compte :</strong> {{ ucfirst($user->role) }}<br>
        <strong>Date de suspension :</strong> {{ date('d/m/Y à H:i') }}<br>
        <strong>Statut :</strong> Suspendu
    </div>

    <div class="message">
        Si vous pensez que cette suspension est une erreur ou si vous avez des questions, 
        n'hésitez pas à contacter notre équipe de support.
    </div>

    <div class="highlight-box" style="border-left: 4px solid #2563eb; background-color: #eff6ff;">
        <h3>📞 Support Client</h3>
        Email : support@proprio-link.fr<br>
        Nous nous efforçons de répondre dans les 24-48 heures.
    </div>

@endsection