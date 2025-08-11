<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propriété approuvée</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #333;">Propriété approuvée et publiée</h1>
                        </td>
                    </tr>
                </table>

                <!-- Success Notice -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="margin: 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dadce0; text-align: center;">
                                <strong>Nouvelle propriété mise en ligne</strong><br>
                                La propriété est maintenant visible par les agents
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Property Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0; text-align: center; background-color: #f8f9fa; border: 1px solid #e0e0e0;">
                            <h2 style="margin: 0; margin-bottom: 10px; font-size: 20px; font-weight: 500;">{{ $property->type_propriete }}</h2>
                            <p style="margin: 0; margin-bottom: 10px;">{{ $property->adresse_complete }}</p>
                            <p style="margin: 0; margin-bottom: 10px; font-size: 18px; font-weight: 500;">{{ number_format($property->prix, 0, ',', ' ') }}€</p>
                            <p style="margin: 0;">{{ $property->ville }}, {{ $property->pays }}</p>
                        </td>
                    </tr>
                </table>

                <!-- Property Details -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 20px;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Superficie :</strong> {{ $property->superficie_m2 }} m²
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Prix au m² :</strong> {{ number_format($property->prix / $property->superficie_m2, 0, ',', ' ') }}€
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Contacts disponibles :</strong> {{ $property->contacts_restants }} / {{ $property->contacts_souhaites }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Statut :</strong> {{ $property->statut }}
                        </td>
                    </tr>
                </table>

                <!-- Owner Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Propriétaire :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Nom complet :</strong> {{ $owner->prenom }} {{ $owner->nom }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Email :</strong> {{ $owner->email }}
                        </td>
                    </tr>
                </table>

                @if($moderator)
                <!-- Moderator Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Modérateur :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Approuvée par :</strong> {{ $moderator->prenom }} {{ $moderator->nom }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Date d'approbation :</strong> {{ now()->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Important Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Informations importantes :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>ID de la propriété :</strong> {{ $property->id }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Date de création :</strong> {{ $property->created_at->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Images :</strong> {{ $property->images->count() }} image(s)
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Revenue potentiel :</strong> {{ number_format($property->contacts_souhaites * 15, 0, ',', ' ') }}€
                        </td>
                    </tr>
                </table>

                <!-- Next Steps -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Prochaines étapes :</strong></p>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>La propriété est maintenant visible par tous les agents</li>
                                <li>Le propriétaire a été notifié par email</li>
                                <li>Les agents peuvent commencer à acheter les contacts</li>
                                <li>Surveillez les transactions et les revenus générés</li>
                            </ul>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Notification automatique d'approbation
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
