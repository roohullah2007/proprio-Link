{{-- resources/views/emails/auth/verification-code-blue.blade.php --}}
@extends('emails.layout-blue')

@section('subject', 'Code de vérification - Proprio Link')

@section('content')
    <div class="greeting">
        Code de vérification
    </div>

    <div class="message">
        Bonjour,
    </div>

    <div class="message">
        Voici votre code de vérification pour Proprio Link :
    </div>

    <!-- Verification Code Display -->
    <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #2563eb; border-radius: 12px; padding: 25px 35px; margin: 20px 0;">
            <div style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #1e40af; letter-spacing: 12px; text-align: center;">
                {{ $code }}
            </div>
            <div style="font-size: 13px; color: #1e40af; margin-top: 12px; text-align: center; font-weight: 500;">
                Code de vérification
            </div>
        </div>
    </div>

    <div class="info-badge">
        Ce code expire dans 15 minutes
    </div>

    <div class="highlight-box">
        <h3>Instructions :</h3>
        <div style="font-size: 14px;">
            1. <strong>Saisissez ce code</strong> dans le champ de vérification sur le site<br>
            2. <strong>Utilisez-le rapidement</strong> - il expire dans 15 minutes<br>
            3. <strong>Une seule utilisation</strong> - le code ne fonctionne qu'une fois
        </div>
    </div>

    <div class="highlight-box" style="background-color: #fef3cd; border-left-color: #f59e0b;">
        <h3 style="color: #d97706;">Sécurité importante</h3>
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
        Cordialement,<br>
        L'équipe Proprio Link
    </div>

    <div class="divider"></div>

    <div class="message" style="font-size: 14px; color: #6b7280;">
        Si vous n'avez pas créé de compte sur Proprio Link, ignorez cet email. 
        Aucune action ne sera effectuée sur votre adresse email.
    </div>
@endsection
