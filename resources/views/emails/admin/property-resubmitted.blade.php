<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Updated After Edit Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 40px 30px;">
                
                <!-- Header -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #333;">Property Updated After Edit Request</h1>
                        </td>
                    </tr>
                </table>

                <!-- Alert Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 20px; background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
                            <p style="margin: 0; color: #0369a1; font-weight: 500;">
                                ✅ The property owner has updated their listing following your edit request. Please review the changes.
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

                <!-- Edit Requests that were addressed -->
                @if($editRequests->count() > 0)
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Edit requests that were addressed:</strong></p>
                        </td>
                    </tr>
                </table>

                @foreach($editRequests as $editRequest)
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <tr>
                        <td style="padding: 15px; background-color: #fafafa;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Requested changes:</strong></p>
                            <p style="margin: 0; padding: 10px; background-color: white; border-left: 4px solid #dadce0; margin-bottom: 10px;">
                                {{ $editRequest->requested_changes }}
                            </p>
                            @if($editRequest->admin_notes)
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Admin notes:</strong></p>
                            <p style="margin: 0; padding: 10px; background-color: white; border-left: 4px solid #dadce0;">
                                {{ $editRequest->admin_notes }}
                            </p>
                            @endif
                            <p style="margin: 0; margin-top: 10px; font-size: 12px; color: #666;">
                                <strong>Request date:</strong> {{ $editRequest->created_at->format('d/m/Y à H:i') }}
                            </p>
                        </td>
                    </tr>
                </table>
                @endforeach
                @endif

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

                <!-- Update Details -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 15px;"><strong>Détails de la mise à jour :</strong></p>
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
                            <strong>Date de mise à jour :</strong> {{ $property->updated_at->format('d/m/Y à H:i') }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0;">
                            <strong>Statut actuel :</strong> {{ $property->statut }}
                        </td>
                    </tr>
                </table>

                <!-- Action Button -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                        <td style="text-align: center;">
                            <a href="{{ $adminPropertyUrl }}" style="display: inline-block; padding: 15px 25px; background-color: #1e40af; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 16px;">
                                Review Updated Property
                            </a>
                        </td>
                    </tr>
                </table>

                <!-- Actions Required -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px 0;">
                            <p style="margin: 0; margin-bottom: 10px;"><strong>Actions requises :</strong></p>
                            <p style="margin: 0; margin-bottom: 10px;">Please review the updated property and the changes made in response to your edit request.</p>
                            <ul style="margin: 0; padding-left: 20px;">
                                <li>Verify that the requested changes have been implemented</li>
                                <li>Check if the property information is now accurate</li>
                                <li>Review any new images or updated descriptions</li>
                                <li>Mark the edit request as completed if satisfied</li>
                                <li>Approve or request additional changes if needed</li>
                            </ul>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-top: 30px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0; font-size: 12px; color: #666;">
                                Notification automatique de mise à jour de propriété
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>