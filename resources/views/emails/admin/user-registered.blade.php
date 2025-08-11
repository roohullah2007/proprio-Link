<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvel utilisateur inscrit</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #333;">Nouvel utilisateur inscrit</h1>
                        </td>
                    </tr>
                </table>

                <!-- Content -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="margin: 0; margin-bottom: 20px;">Un nouvel utilisateur vient de s'inscrire sur la plateforme :</p>
                        </td>
                    </tr>
                </table>

                <!-- User Details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Nom complet :</strong> {{ $user->prenom }} {{ $user->nom }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Adresse email :</strong> {{ $user->email }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Téléphone :</strong> {{ $user->telephone ?: 'Non renseigné' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Type d'utilisateur :</strong> {{ $user->type_utilisateur }}
                        </td>
                    </tr>
                    
                    @if($user->type_utilisateur === 'AGENT')
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Numéro SIRET :</strong> {{ $user->numero_siret ?: 'Non renseigné' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Licence professionnelle :</strong> 
                            @if($user->licence_professionnelle_url)
                                Document fourni
                            @else
                                Non fournie
                            @endif
                        </td>
                    </tr>
                    @endif
                    
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Date d'inscription :</strong> {{ $user->created_at->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Langue préférée :</strong> {{ $user->language === 'fr' ? 'Français' : 'Anglais' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Statut de vérification :</strong> {{ $user->est_verifie ? 'Vérifié' : 'En attente de vérification' }}
                        </td>
                    </tr>
                </table>

                @if($user->type_utilisateur === 'AGENT')
                <!-- Verification Notice -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dadce0;">
                                <strong>Vérification requise :</strong><br>
                                Cet utilisateur doit vérifier son adresse email pour accéder à la plateforme. Une fois vérifié, il devra également être approuvé par un administrateur pour accéder aux fonctionnalités d'agent.
                            </p>
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Email automatique envoyé depuis la plateforme
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
