<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle propriété soumise</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #333;">Nouvelle propriété à examiner</h1>
                        </td>
                    </tr>
                </table>

                <!-- Property Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0; text-align: center; background-color: #f8f9fa; border: 1px solid #e0e0e0;">
                            <h2 style="margin: 0; margin-bottom: 10px; font-size: 20px; font-weight: 500;">{{ $property->type_propriete }}</h2>
                            <p style="margin: 0; margin-bottom: 10px;">{{ $property->adresse_complete }}</p>
                            <p style="margin: 0; font-size: 18px; font-weight: 500;">{{ number_format($property->prix, 0, ',', ' ') }}€</p>
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
                            <strong>Ville :</strong> {{ $property->ville }}, {{ $property->pays }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Contacts souhaités :</strong> {{ $property->contacts_souhaites }}
                        </td>
                    </tr>
                    
                    @if($property->nombre_pieces)
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Nombre de pièces :</strong> {{ $property->nombre_pieces }}
                        </td>
                    </tr>
                    @endif

                    @if($property->nombre_chambres)
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Chambres :</strong> {{ $property->nombre_chambres }}
                        </td>
                    </tr>
                    @endif
                    
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Images :</strong> 
                            @if($property->images->count() > 0)
                                {{ $property->images->count() }} image(s) téléchargée(s)
                            @else
                                Aucune image téléchargée
                            @endif
                        </td>
                    </tr>
                </table>

                @if($property->description)
                <!-- Description -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Description :</strong></p>
                            <p style="margin: 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dadce0;">
                                {{ Str::limit($property->description, 300) }}
                            </p>
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Owner Information -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Informations du propriétaire :</strong></p>
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
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Email :</strong> {{ $owner->email }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                            <strong>Téléphone :</strong> {{ $owner->telephone ?: 'Non renseigné' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Type d'utilisateur :</strong> {{ $owner->type_utilisateur }}
                        </td>
                    </tr>
                </table>

                <!-- Submission Details -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Détails de la soumission :</strong></p>
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
                            <strong>Date de soumission :</strong> {{ $property->created_at->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Statut actuel :</strong> {{ $property->statut }}
                        </td>
                    </tr>
                </table>

                @if($property->informations_complementaires)
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Informations complémentaires :</strong></p>
                            <p style="margin: 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #dadce0;">
                                {{ Str::limit($property->informations_complementaires, 100) }}
                            </p>
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Actions Required -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Actions requises :</strong></p>
                            <p style="margin: 0; margin-bottom: 10px;">Cette propriété nécessite votre examen pour approbation ou rejet.</p>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>Vérifiez la véracité des informations</li>
                                <li>Contrôlez la qualité des images</li>
                                <li>Assurez-vous que la description est appropriée</li>
                                <li>Validez que le prix est cohérent avec le marché</li>
                            </ul>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Notification automatique de soumission
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
