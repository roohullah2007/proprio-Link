<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau contact acheté</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #333;">Nouveau contact acheté</h1>
                        </td>
                    </tr>
                </table>

                <!-- Transaction Success -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="margin: 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dadce0; text-align: center;">
                                <strong>Nouvelle transaction réussie</strong><br>
                                <span style="font-size: 18px; font-weight: 500;">{{ number_format($purchase->montant_paye, 2) }}€</span><br>
                                Paiement confirmé via Stripe
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Agent Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Informations de l'agent :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Nom de l'agent :</strong> {{ $agent->prenom }} {{ $agent->nom }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Email :</strong> {{ $agent->email }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Téléphone :</strong> {{ $agent->telephone ?: 'Non renseigné' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>SIRET :</strong> {{ $agent->numero_siret ?: 'Non renseigné' }}
                        </td>
                    </tr>
                </table>

                <!-- Property Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Propriété concernée :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Type :</strong> {{ $property->type_propriete }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Prix :</strong> {{ number_format($property->prix, 0, ',', ' ') }}€
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Adresse complète :</strong> {{ $property->adresse_complete }}
                        </td>
                    </tr>
                </table>

                <!-- Owner Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Propriétaire contacté :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Nom du propriétaire :</strong> {{ $owner->prenom }} {{ $owner->nom }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Email :</strong> {{ $owner->email }}
                        </td>
                    </tr>
                </table>

                <!-- Transaction Details -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Détails de la transaction :</strong></p>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>ID de transaction :</strong> {{ $purchase->id }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Date :</strong> {{ $purchase->created_at->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Stripe Payment ID :</strong> {{ $purchase->stripe_payment_intent_id }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Statut :</strong> {{ $purchase->statut_paiement }}
                        </td>
                    </tr>
                </table>

                <!-- Important Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Informations importantes :</strong></p>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>L'agent peut maintenant contacter directement le propriétaire</li>
                                <li>Une facture a été automatiquement générée</li>
                                <li>Les contacts restants de la propriété ont été mis à jour</li>
                            </ul>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Notification automatique de vente
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
