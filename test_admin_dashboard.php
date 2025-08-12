<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\Property;
use App\Models\ContactPurchase;
use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=================================\n";
echo "ADMIN DASHBOARD DEBUG TEST\n";
echo "=================================\n\n";

// Test Property Model
echo "1. PROPERTY MODEL TEST:\n";
echo "-----------------------\n";
echo "STATUT_EN_ATTENTE constant: " . Property::STATUT_EN_ATTENTE . "\n";
echo "Properties with EN_ATTENTE: " . Property::where('statut', Property::STATUT_EN_ATTENTE)->count() . "\n";
echo "Properties with 'EN_ATTENTE' string: " . Property::where('statut', 'EN_ATTENTE')->count() . "\n\n";

// Direct DB query
echo "2. DIRECT DATABASE QUERY:\n";
echo "-------------------------\n";
$pendingDirect = DB::table('properties')->where('statut', 'EN_ATTENTE')->count();
echo "Direct DB query EN_ATTENTE: " . $pendingDirect . "\n\n";

// List all properties
echo "3. ALL PROPERTIES:\n";
echo "------------------\n";
$allProps = Property::select('id', 'statut', 'ville')->get();
foreach($allProps as $p) {
    echo "ID: " . substr($p->id, 0, 20) . "... | Status: '" . $p->statut . "' | City: " . $p->ville . "\n";
}

// Test ContactPurchase
echo "\n4. CONTACT PURCHASE TEST:\n";
echo "-------------------------\n";
echo "STATUS_SUCCEEDED constant: " . ContactPurchase::STATUS_SUCCEEDED . "\n";
echo "Purchases with succeeded: " . ContactPurchase::where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)->count() . "\n";
echo "Total earnings: " . ContactPurchase::where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)->sum('montant_paye') . "\n\n";

// Test exact controller queries
echo "5. EXACT CONTROLLER QUERIES:\n";
echo "----------------------------\n";
$stats = [
    'properties_pending' => Property::where('statut', Property::STATUT_EN_ATTENTE)->count(),
    'total_earnings' => ContactPurchase::where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)->sum('montant_paye'),
    'total_transactions' => ContactPurchase::where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)->count(),
    'total_users' => User::count(),
];

echo "properties_pending: " . $stats['properties_pending'] . "\n";
echo "total_earnings: " . $stats['total_earnings'] . "\n";
echo "total_transactions: " . $stats['total_transactions'] . "\n";
echo "total_users: " . $stats['total_users'] . "\n\n";

// Get recent properties
echo "6. RECENT PENDING PROPERTIES:\n";
echo "-----------------------------\n";
$recentProperties = Property::with(['proprietaire'])
    ->where('statut', Property::STATUT_EN_ATTENTE)
    ->orderBy('created_at', 'desc')
    ->limit(5)
    ->get();

echo "Found " . $recentProperties->count() . " pending properties\n";
foreach($recentProperties as $prop) {
    echo "- " . $prop->ville . " (" . $prop->type_propriete . ") - Owner: " . ($prop->proprietaire ? $prop->proprietaire->nom : 'NO OWNER') . "\n";
}

echo "\n=================================\n";
echo "END OF DEBUG TEST\n";
echo "=================================\n";