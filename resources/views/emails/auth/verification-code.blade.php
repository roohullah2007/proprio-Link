{{-- resources/views/emails/auth/verification-code.blade.php --}}
@extends('emails.layout')

@section('subject', 'Code de vérification - Proprio Link')

@section('content')
    <div class="greeting">
        Code de vérification
    </div>

    <div class="message">
        Voici votre code de vérification pour Proprio Link :
    </div>

    <!-- Verification Code Display -->
    <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #2563eb; border-radius: 10px; padding: 20px 30px; margin: 20px 0;">
            <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; text-align: center;">
                {{ $code }}
            </div>
            <div style="font-size: 12px; color: #6c757d; margin-top: 10px; text-align: center;">
                Code de vérification
            </div>
        </div>
    </div>

    <div class="highlight-box">
        <h3>📱 Instructions :</h3>
        <div style="font-size: 14px;">
            1. <strong>Saisissez ce code</strong> dans le champ de vérification<br>
            2. <strong>Utilisez-le rapidement</strong> - il expire dans 15 minutes<br>
            3. <strong>Une seule utilisation</strong> - le code ne fonctionne qu'une fois
        </div>
    </div>

    <div class="warning-badge">
        ⏰ Ce code expire dans 15 minutes
    </div>

    <div class="highlight-box" style="background-color: #fef3cd; border-left-color: #f59e0b;">
        <h3 style="color: #f59e0b;">⚠️ Sécurité</h3>
        <div style="font-size: 14px; color: #92400e;">
            • Ne partagez jamais ce code avec personne<br>
            • Proprio Link ne vous demandera jamais votre code par téléphone<br>
            • Si vous n'avez pas demandé ce code, ignorez cet email<br>
            • Ce code ne fonctionne que pour votre compte
        </div>
    </div>

    <div class="message">
        <strong>Problème avec le code ?</strong><br>
        • Vérifiez que vous avez saisi tous les 6 chiffres<br>
        • Assurez-vous que le code n'a pas expiré<br>
        • Demandez un nouveau code si nécessaire
    </div>

    <div class="message">
        <strong>Alternative :</strong><br>
        Vous pouvez également utiliser le lien de vérification par email 
        si vous préférez cette méthode.
    </div>

    <div class="message">
        Si vous n'avez pas créé de compte sur Proprio Link, ignorez cet email. 
        Aucune action ne sera effectuée sur votre adresse email.
    </div>
@endsection
