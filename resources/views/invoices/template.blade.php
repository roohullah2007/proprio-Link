<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .invoice-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .invoice-info .left,
        .invoice-info .right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .invoice-info .right {
            text-align: right;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .details-table th,
        .details-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        .details-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #2563eb;
        }
        .amount {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .payment-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .thank-you {
            text-align: center;
            font-style: italic;
            color: #2563eb;
            margin: 30px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Proprio Link</div>
        <div>Plateforme de mise en relation immobilière</div>
    </div>

    <div class="invoice-info">
        <div class="left">
            <div class="section-title">Facturé à</div>
            <strong>{{ $invoice->agent_name }}</strong><br>
            @if(isset($invoice->billing_details['agent']['phone']))
                Tél: {{ $invoice->billing_details['agent']['phone'] }}<br>
            @endif
            @if(isset($invoice->billing_details['agent']['siret']))
                SIRET: {{ $invoice->billing_details['agent']['siret'] }}<br>
            @endif
        </div>
        <div class="right">
            <div class="section-title">Informations de facturation</div>
            <strong>Facture N°: {{ $invoice->invoice_number }}</strong><br>
            Date d'émission: {{ $invoice->issued_at->format('d/m/Y') }}<br>
            Date d'achat: {{ \Carbon\Carbon::parse($invoice->billing_details['purchase_date'])->format('d/m/Y H:i') }}<br>
        </div>
    </div>

    <div class="payment-info">
        <div class="section-title">Détails du paiement</div>
        ID de paiement Stripe: {{ $invoice->billing_details['stripe_payment_id'] ?? 'N/A' }}<br>
        Mode de paiement: Carte bancaire (Stripe)
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Propriété</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong>Achat de contact propriétaire</strong><br>
                    <small>Accès aux informations de contact du propriétaire</small>
                </td>
                <td>
                    {{ $invoice->property_reference }}<br>
                    @if(isset($invoice->billing_details['property']['city']))
                        <small>{{ $invoice->billing_details['property']['city'] }}</small>
                    @endif
                </td>
                <td>1</td>
                <td class="amount">{{ number_format($invoice->amount, 2, ',', ' ') }} {{ $invoice->currency }}</td>
                <td class="amount">{{ number_format($invoice->amount, 2, ',', ' ') }} {{ $invoice->currency }}</td>
            </tr>
        </tbody>
    </table>

    <div style="text-align: right; margin-bottom: 30px;">
        <div style="font-size: 16px; margin-bottom: 10px;">
            <strong>Sous-total HT: {{ number_format($invoice->amount / 1.2, 2, ',', ' ') }} {{ $invoice->currency }}</strong>
        </div>
        <div style="font-size: 14px; margin-bottom: 10px;">
            TVA (20%): {{ number_format($invoice->amount - ($invoice->amount / 1.2), 2, ',', ' ') }} {{ $invoice->currency }}
        </div>
        <div style="font-size: 18px; padding: 10px; background-color: #f5f5f5; border: 2px solid #2563eb;">
            <strong>Total TTC: {{ number_format($invoice->amount, 2, ',', ' ') }} {{ $invoice->currency }}</strong>
        </div>
    </div>

    <div class="thank-you">
        Merci pour votre confiance !
    </div>

    <div style="margin-top: 40px; font-size: 11px;">
        <div class="section-title">Conditions générales</div>
        <p>
            Cette facture correspond à l'achat d'informations de contact d'un propriétaire via la plateforme Proprio Link. 
            Le paiement a été traité de manière sécurisée par Stripe. 
            Cette transaction vous donne accès aux coordonnées du propriétaire de la propriété mentionnée ci-dessus.
        </p>
        <p>
            <strong>Politique de remboursement:</strong> Conformément à l'article L221-28 du Code de la consommation, 
            le droit de rétractation ne s'applique pas aux contenus numériques non fournis sur un support matériel 
            dont l'exécution a commencé après accord préalable exprès du consommateur.
        </p>
    </div>

    <div class="footer">
        <div>Proprio Link - Plateforme de mise en relation immobilière</div>
        <div>Web: https://proprio-link.fr</div>
        <div>Contact: https://proprio-link.fr/contact</div>
        <div>Document généré automatiquement le {{ now()->format('d/m/Y à H:i') }}</div>
    </div>
</body>
</html>
