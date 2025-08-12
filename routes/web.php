<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Admin\PropertyEditRequestController;
use App\Models\Property;
use App\Models\ContactPurchase;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

// Route to check and fix storage symlink
Route::get('/fix-storage', function () {
    $publicStoragePath = public_path('storage');
    $targetPath = storage_path('app/public');
    
    // Check if symlink exists
    if (!file_exists($publicStoragePath)) {
        // Try to create the symlink
        try {
            if (PHP_OS_FAMILY === 'Windows') {
                // Windows symlink
                $result = shell_exec("mklink /D \"$publicStoragePath\" \"$targetPath\"");
            } else {
                // Unix/Linux symlink
                $result = symlink($targetPath, $publicStoragePath);
            }
            
            if (file_exists($publicStoragePath)) {
                return response()->json([
                    'success' => true,
                    'message' => 'Storage symlink created successfully!',
                    'public_path' => $publicStoragePath,
                    'target_path' => $targetPath
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create symlink. Please run: php artisan storage:link',
                    'public_path' => $publicStoragePath,
                    'target_path' => $targetPath
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating symlink: ' . $e->getMessage(),
                'solution' => 'Please run: php artisan storage:link'
            ]);
        }
    } else {
        return response()->json([
            'success' => true,
            'message' => 'Storage symlink already exists!',
            'public_path' => $publicStoragePath,
            'target_path' => $targetPath,
            'is_link' => is_link($publicStoragePath)
        ]);
    }
})->name('fix.storage');

// Enhanced image serving route when storage symlink is missing
Route::get('/images/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        // Return a 1x1 transparent pixel as fallback
        $pixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
        return response($pixel)->header('Content-Type', 'image/png');
    }
    
    $mimeType = mime_content_type($filePath);
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000'
    ]);
})->where('path', '.*')->name('serve.image');

// Enhanced backup storage route for property images
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    // Log the request for debugging
    \Log::info('Image request via backup route', [
        'path' => $path,
        'file_exists' => file_exists($filePath),
        'file_path' => $filePath
    ]);
    
    if (!file_exists($filePath)) {
        // Try alternative paths or return 404
        abort(404, 'Image not found: ' . $path);
    }
    
    $mimeType = mime_content_type($filePath);
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
        'Expires' => gmdate('D, d M Y H:i:s T', time() + 31536000)
    ]);
})->where('path', '.*')->name('serve.storage');

// FALLBACK: Direct profile image serving route
Route::get('/storage/profile-images/{filename}', function ($filename) {
    $filePath = storage_path('app/public/profile-images/' . $filename);
    
    if (!file_exists($filePath)) {
        abort(404, 'Image not found');
    }
    
    $mimeType = mime_content_type($filePath);
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
        'Expires' => gmdate('D, d M Y H:i:s T', time() + 31536000)
    ]);
})->name('serve.profile.image');

// Debug route for profile updates
Route::get('/debug-profile', function () {
    $user = Auth::user();
    
    if (!$user) {
        return response()->json(['error' => 'Not authenticated']);
    }
    
    return response()->json([
        'user_id' => $user->id,
        'current_data' => [
            'prenom' => $user->prenom,
            'nom' => $user->nom,
            'email' => $user->email,
            'telephone' => $user->telephone,
        ],
        'fillable_fields' => $user->getFillable(),
        'database_table' => $user->getTable(),
        'profile_update_route' => route('profile.update'),
    ]);
})->middleware('auth')->name('debug.profile');

// Test profile update route
Route::post('/debug-profile-update', function (Request $request) {
    $user = Auth::user();
    
    if (!$user) {
        return response()->json(['error' => 'Not authenticated']);
    }
    
    $validated = $request->validate([
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'telephone' => 'nullable|string|max:20',
    ]);
    
    $originalData = [
        'prenom' => $user->prenom,
        'nom' => $user->nom,
        'email' => $user->email,
        'telephone' => $user->telephone,
    ];
    
    // Update the user
    $user->fill($validated);
    $saved = $user->save();
    
    // Refresh user from database
    $user->refresh();
    
    return response()->json([
        'success' => $saved,
        'original_data' => $originalData,
        'submitted_data' => $validated,
        'updated_data' => [
            'prenom' => $user->prenom,
            'nom' => $user->nom,
            'email' => $user->email,
            'telephone' => $user->telephone,
        ],
        'changes_detected' => $user->wasChanged(),
        'changed_fields' => $user->getChanges(),
    ]);
})->middleware('auth')->name('debug.profile.update');

// Route to create storage symlink if missing
Route::get('/fix-storage-link', function () {
    try {
        $publicStoragePath = public_path('storage');
        $targetPath = storage_path('app/public');
        
        // Check if symlink exists
        $symlinkExists = is_link($publicStoragePath);
        $symlinkTarget = $symlinkExists ? readlink($publicStoragePath) : null;
        
        if (!$symlinkExists) {
            // Create the symlink
            \Artisan::call('storage:link');
            $output = \Artisan::output();
            
            return response()->json([
                'success' => true,
                'message' => 'Storage symlink created successfully!',
                'command_output' => $output,
                'symlink_path' => $publicStoragePath,
                'target_path' => $targetPath,
                'new_symlink_exists' => is_link($publicStoragePath)
            ]);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'Storage symlink already exists',
                'symlink_path' => $publicStoragePath,
                'target' => $symlinkTarget,
                'target_exists' => file_exists($symlinkTarget)
            ]);
        }
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create storage symlink',
            'error' => $e->getMessage(),
            'suggestion' => 'Try running "php artisan storage:link" in terminal manually'
        ]);
    }
});

// Test widget API endpoint
Route::get('/test-widget-api', function () {
    try {
        $searchTerm = request('q', 'karachi');
        
        $response = app()->call('App\Http\Controllers\Api\WidgetController@searchProperties', [
            'request' => request()->merge([
                'search_term' => $searchTerm,
                'widget_id' => 'test-widget-123'
            ])
        ]);
        
        return $response;
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Debug route to check properties
Route::get('/debug-properties', function () {
    $allProperties = \App\Models\Property::all();
    $publishedProperties = \App\Models\Property::where('statut', 'PUBLIE')->get();
    $propertiesWithContacts = \App\Models\Property::where('statut', 'PUBLIE')
        ->where('contacts_restants', '>', 0)
        ->get();
    
    return response()->json([
        'total_properties' => $allProperties->count(),
        'published_properties' => $publishedProperties->count(),
        'available_properties' => $propertiesWithContacts->count(),
        'all_properties' => $allProperties->map(function($p) {
            return [
                'id' => $p->id,
                'ville' => $p->ville,
                'type_propriete' => $p->type_propriete,
                'statut' => $p->statut,
                'contacts_restants' => $p->contacts_restants,
                'description' => substr($p->description ?? '', 0, 100),
            ];
        }),
        'published_properties_details' => $publishedProperties->map(function($p) {
            return [
                'id' => $p->id,
                'ville' => $p->ville,
                'type_propriete' => $p->type_propriete,
                'contacts_restants' => $p->contacts_restants,
                'description' => substr($p->description ?? '', 0, 100),
            ];
        }),
        'property_statuses' => [
            'EN_ATTENTE' => \App\Models\Property::where('statut', 'EN_ATTENTE')->count(),
            'PUBLIE' => \App\Models\Property::where('statut', 'PUBLIE')->count(),
            'REJETE' => \App\Models\Property::where('statut', 'REJETE')->count(),
            'VENDU' => \App\Models\Property::where('statut', 'VENDU')->count(),
        ]
    ]);
});

// Test search functionality
Route::get('/debug-search', function () {
    $searchTerm = request('q', 'karachi');
    
    $query = \App\Models\Property::with(['images'])
        ->where('statut', 'PUBLIE')
        ->where('contacts_restants', '>', 0);
    
    if ($searchTerm) {
        $query->where(function ($q) use ($searchTerm) {
            $q->where('description', 'like', "%{$searchTerm}%")
              ->orWhere('ville', 'like', "%{$searchTerm}%")
              ->orWhere('adresse_complete', 'like', "%{$searchTerm}%")
              ->orWhere('pays', 'like', "%{$searchTerm}%")
              ->orWhere('type_propriete', 'like', "%{$searchTerm}%");
        });
    }
    
    $results = $query->get();
    
    return response()->json([
        'search_term' => $searchTerm,
        'total_results' => $results->count(),
        'sql_query' => $query->toSql(),
        'bindings' => $query->getBindings(),
        'results' => $results->map(function($p) {
            return [
                'id' => $p->id,
                'uuid' => $p->uuid,
                'ville' => $p->ville,
                'pays' => $p->pays,
                'type_propriete' => $p->type_propriete,
                'prix' => $p->prix,
                'statut' => $p->statut,
                'contacts_restants' => $p->contacts_restants,
                'description' => substr($p->description ?? '', 0, 100),
                'adresse_complete' => substr($p->adresse_complete ?? '', 0, 100),
            ];
        })
    ]);
});

// Simple HTML page to fix storage issues
Route::get('/storage-admin', function () {
    return '
    <!DOCTYPE html>
    <html>
    <head>
        <title>Storage Admin - Proprio Link</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .card { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .btn:hover { background: #0056b3; }
            .success { color: #28a745; }
            .error { color: #dc3545; }
            .info { color: #17a2b8; }
        </style>
    </head>
    <body>
        <h1>Storage Admin - Proprio Link</h1>
        
        <div class="card">
            <h3>Fix Storage Symlink</h3>
            <p>Click the button below to create the storage symlink if it\'s missing:</p>
            <button class="btn" onclick="fixStorage()">Fix Storage Link</button>
            <div id="result"></div>
        </div>

        <div class="card">
            <h3>Test Storage Access</h3>
            <button class="btn" onclick="testStorage()">Test Storage</button>
            <div id="test-result"></div>
        </div>

        <script>
            async function fixStorage() {
                const result = document.getElementById("result");
                result.innerHTML = "<p class=\"info\">Creating symlink...</p>";
                
                try {
                    const response = await fetch("/fix-storage-link");
                    const data = await response.json();
                    
                    if (data.success) {
                        result.innerHTML = `<p class="success">✓ ${data.message}</p>`;
                    } else {
                        result.innerHTML = `<p class="error">✗ ${data.message}<br><small>${data.error}</small></p>`;
                    }
                } catch (error) {
                    result.innerHTML = `<p class="error">✗ Error: ${error.message}</p>`;
                }
            }

            async function testStorage() {
                const result = document.getElementById("test-result");
                result.innerHTML = "<p class=\"info\">Testing storage...</p>";
                
                try {
                    const response = await fetch("/test-storage");
                    const data = await response.json();
                    
                    result.innerHTML = `
                        <p class="success">✓ Storage test completed</p>
                        <p><strong>Symlink exists:</strong> ${data.symlink_exists ? "Yes" : "No"}</p>
                        <p><strong>Properties with images:</strong> ${data.properties.length}</p>
                    `;
                } catch (error) {
                    result.innerHTML = `<p class="error">✗ Error: ${error.message}</p>`;
                }
            }
        </script>
    </body>
    </html>';
});

// Test route for debugging image storage
Route::get('/test-storage', function () {
    $properties = \App\Models\Property::with('images')->take(5)->get();
    
    $debug_info = [];
    foreach ($properties as $property) {
        $property_debug = [
            'id' => $property->id,
            'images_count' => $property->images->count(),
            'images' => []
        ];
        
        foreach ($property->images as $image) {
            $file_path = storage_path('app/public/' . $image->chemin_fichier);
            $public_url = asset('storage/' . $image->chemin_fichier);
            
            $property_debug['images'][] = [
                'id' => $image->id,
                'chemin_fichier' => $image->chemin_fichier,
                'file_exists' => file_exists($file_path),
                'file_path' => $file_path,
                'public_url' => $public_url,
                'storage_url' => \Storage::url($image->chemin_fichier),
            ];
        }
        
        $debug_info[] = $property_debug;
    }
    
    return response()->json([
        'storage_path' => storage_path('app/public'),
        'public_path' => public_path('storage'),
        'symlink_exists' => is_link(public_path('storage')),
        'symlink_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
        'properties' => $debug_info
    ]);
})->middleware(['auth']);

// Test route for debugging translations
Route::get('/test-translations', function () {
    $locale = app()->getLocale();
    $translations = [];
    
    $translationsPath = lang_path($locale . '.json');
    if (file_exists($translationsPath)) {
        $translations = json_decode(file_get_contents($translationsPath), true) ?? [];
    }
    
    return Inertia::render('Dashboard', [
        'debug_info' => [
            'current_locale' => $locale,
            'session_locale' => session('locale'),
            'translations_count' => count($translations),
            'sample_translations' => array_slice($translations, 0, 10)
        ]
    ]);
})->middleware(['auth']);

Route::get('/', function () {
    // If user is authenticated, redirect to dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    
    // If not authenticated, redirect directly to login
    return redirect()->route('login');
});

// Public property routes for widgets
Route::middleware(['set.locale'])->group(function () {
    Route::get('/properties/search', [PropertyController::class, 'publicSearch'])->name('properties.search');
    Route::get('/property/{property}', [PropertyController::class, 'showPublic'])->name('property.public');
});

// Note: Main dashboard route is now handled in the Route::middleware('auth')->group() section below

// Language switching routes
Route::post('/language/change', [LanguageController::class, 'change'])->name('language.change');
Route::get('/language/current', [LanguageController::class, 'current'])->name('language.current');

// Test language switching route
Route::get('/test-language', function () {
    return Inertia::render('TestLanguage', [
        'current_locale' => app()->getLocale(),
        'session_locale' => session('locale'),
        'user_language' => auth()->user()?->language,
    ]);
})->middleware(['auth'])->name('test.language');

// Test route for debugging
Route::get('/test-agent', function () {
    $user = Auth::user();
    return response()->json([
        'authenticated' => Auth::check(),
        'user_type' => $user ? $user->type_utilisateur : null,
        'user_verification' => $user ? $user->est_verifie : null,
        'can_access_agent_dashboard' => $user && $user->type_utilisateur === 'AGENT',
    ]);
})->middleware('auth');

// Simple test for agent controller
Route::get('/test-agent-simple', function () {
    return response()->json(['message' => 'Agent controller test route working']);
})->middleware(['auth', 'agent']);

// Test route for new Stripe-inspired dashboard
Route::get('/test-dashboard', function () {
    // Mock data for testing
    $mockStats = [
        'available_properties' => 1247,
        'purchases_this_month' => 23,
        'total_spent' => 3450,
        'total_properties' => 5621,
        'revenue_this_month' => 2850,
        'conversion_rate' => 3.2,
        'avg_property_price' => 285000,
        'growth_rate' => 12.5
    ];
    
    return Inertia::render('TestDashboard', [
        'stats' => $mockStats
    ]);
})->middleware(['auth']);

// Debug profile page
Route::get('/debug-profile-page', function () {
    return Inertia::render('DebugProfile');
})->middleware(['auth'])->name('debug.profile.page');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/image', [ProfileController::class, 'removeProfileImage'])->name('profile.remove-image');
    
    // New separate profile image upload routes
    Route::post('/profile/upload-image', [\App\Http\Controllers\ProfileImageController::class, 'upload'])->name('profile.upload-image');
    Route::delete('/profile/remove-image', [\App\Http\Controllers\ProfileImageController::class, 'remove'])->name('profile.remove-image-new');
    
    // Property routes for authenticated users
    Route::resource('properties', PropertyController::class);
    Route::post('/properties/{property}/add-images', [PropertyController::class, 'addImages'])->name('properties.add-images');
    Route::delete('/property-images/{image}', [PropertyController::class, 'deleteImage'])->name('property-images.destroy');
    
    // Payment routes for agents
    Route::prefix('payment')->name('payment.')->group(function () {
        Route::get('/properties/{property}', [PaymentController::class, 'showPaymentForm'])->name('form');
        Route::post('/properties/{property}/create-intent', [PaymentController::class, 'createPaymentIntent'])->name('create-intent');
        Route::post('/confirm', [PaymentController::class, 'confirmPayment'])->name('confirm');
        Route::get('/purchases', [PaymentController::class, 'purchaseHistory'])->name('purchases');
        Route::get('/purchases/{purchase}/contact', [PaymentController::class, 'showContactDetails'])->name('contact-details');
    });
    
    // Invoice routes
    Route::get('/invoices/{purchase}/generate', [App\Http\Controllers\InvoiceController::class, 'generate'])
        ->name('invoices.generate');
    Route::get('/invoices/{invoice}/download', [App\Http\Controllers\InvoiceController::class, 'downloadInvoice'])
        ->name('invoices.download');
    
    // Agent routes
    Route::prefix('agent')->name('agent.')->middleware(['auth', 'agent'])->group(function () {
        Route::get('/dashboard', function () {
            // Check if user needs email verification
            if (!Auth::user()->hasVerifiedEmail()) {
                return redirect()->route('verification.notice');
            }
            
            return app(AgentController::class)->dashboard();
        })->name('dashboard');
        
        Route::get('/properties', [AgentController::class, 'properties'])->name('properties');
        Route::get('/properties/{property}', [AgentController::class, 'showProperty'])->name('property');
        Route::get('/purchases', [AgentController::class, 'purchases'])->name('purchases');
        Route::get('/purchases/{purchase}/contact', [AgentController::class, 'contactDetails'])->name('contact-details');
        Route::get('/invoices', [App\Http\Controllers\InvoiceController::class, 'agentIndex'])->name('invoices');
        Route::get('/search-suggestions', [AgentController::class, 'searchSuggestions'])->name('search-suggestions');
    });
});

// Admin routes (restricted to admin users)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/dashboard', [ModerationController::class, 'dashboard'])->name('dashboard');
    
    // Test route to debug dashboard data
    Route::get('/dashboard-test', function () {
        $controller = app(ModerationController::class);
        
        // Get the exact same data the dashboard method would return
        $stats = [
            'properties_pending' => \App\Models\Property::where('statut', 'EN_ATTENTE')->count(),
            'total_earnings' => \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->sum('montant_paye'),
            'total_transactions' => \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->count(),
            'total_users' => \App\Models\User::count(),
        ];
        
        return response()->json([
            'message' => 'Dashboard test data',
            'stats' => $stats,
            'direct_check' => [
                'properties_table_count' => DB::table('properties')->count(),
                'pending_count' => DB::table('properties')->where('statut', 'EN_ATTENTE')->count(),
                'purchases_count' => DB::table('contact_purchases')->where('statut_paiement', 'succeeded')->count(),
                'earnings_sum' => DB::table('contact_purchases')->where('statut_paiement', 'succeeded')->sum('montant_paye'),
            ]
        ]);
    })->name('dashboard-test');
    
    // Simple HTML test page
    Route::get('/dashboard-html', function () {
        $stats = [
            'properties_pending' => \App\Models\Property::where('statut', 'EN_ATTENTE')->count(),
            'total_earnings' => \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->sum('montant_paye'),
            'total_transactions' => \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->count(),
            'total_users' => \App\Models\User::count(),
        ];
        
        $recentProperties = \App\Models\Property::where('statut', 'EN_ATTENTE')
            ->with('proprietaire')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
            
        return response("
        <h1>Admin Dashboard Test</h1>
        <h2>Statistics:</h2>
        <p>Properties Pending: {$stats['properties_pending']}</p>
        <p>Total Earnings: {$stats['total_earnings']} €</p>
        <p>Total Transactions: {$stats['total_transactions']}</p>
        <p>Total Users: {$stats['total_users']}</p>
        
        <h2>Recent Pending Properties:</h2>
        <ul>
        " . $recentProperties->map(function($p) {
            return "<li>{$p->ville} ({$p->type_propriete}) - Owner: " . ($p->proprietaire ? $p->proprietaire->nom : 'NO OWNER') . "</li>";
        })->implode('') . "
        </ul>
        ");
    })->name('dashboard-html');
    
    
    // Properties Management
    Route::get('/properties/pending', [ModerationController::class, 'pendingProperties'])->name('pending-properties');
    Route::get('/properties/all', [ModerationController::class, 'allProperties'])->name('all-properties');
    Route::get('/properties/{property}/review', [ModerationController::class, 'showProperty'])->name('property-review');
    Route::post('/properties/{property}/approve', [ModerationController::class, 'approveProperty'])->name('approve-property');
    Route::post('/properties/{property}/reject', [ModerationController::class, 'rejectProperty'])->name('reject-property');
    Route::post('/properties/{property}/pending', [ModerationController::class, 'pendingProperty'])->name('pending-property');
    Route::post('/properties/{property}/sold', [ModerationController::class, 'markAsSold'])->name('mark-sold');
    Route::post('/properties/bulk-approve', [ModerationController::class, 'bulkApprove'])->name('bulk-approve');
    Route::delete('/properties/{property}/delete', [ModerationController::class, 'deleteProperty'])->name('delete-property');
    Route::post('/properties/{property}/unapprove', [ModerationController::class, 'unapproveProperty'])->name('unapprove-property');
    Route::post('/properties/{property}/disapprove', [ModerationController::class, 'disapproveProperty'])->name('disapprove-property');
    Route::post('/properties/{property}/reapprove', [ModerationController::class, 'reapproveProperty'])->name('reapprove-property');
    
    // Users Management
    Route::get('/users', [UsersController::class, 'index'])->name('users');
    Route::get('/users/{user}', [UsersController::class, 'show'])->name('users.show');
    Route::post('/users/{user}/verification', [UsersController::class, 'updateVerification'])->name('users.update-verification');
    Route::post('/users/{user}/status', [UsersController::class, 'updateStatus'])->name('users.update-status');
    Route::get('/users/{user}/properties', [UsersController::class, 'properties'])->name('users.properties');
    Route::get('/users/{user}/purchases', [UsersController::class, 'purchases'])->name('users.purchases');
    

    
    // Settings Management
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/test-stripe', [SettingsController::class, 'testStripe'])->name('settings.test-stripe');
    Route::post('/settings/test-smtp', [SettingsController::class, 'testSmtp'])->name('settings.test-smtp');
    
    // Invoice Management (Admin)
    Route::get('/invoices', [App\Http\Controllers\InvoiceController::class, 'adminIndex'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [App\Http\Controllers\InvoiceController::class, 'show'])->name('invoices.show');
    
    // Property Edit Request Management
    Route::post('/properties/{property}/edit-requests', [PropertyEditRequestController::class, 'store'])->name('admin.property-edit-requests.store');
    Route::get('/properties/{property}/edit-requests', [PropertyEditRequestController::class, 'show'])->name('admin.property-edit-requests.show');
    Route::patch('/edit-requests/{editRequest}', [PropertyEditRequestController::class, 'update'])->name('admin.property-edit-requests.update');
    Route::delete('/edit-requests/{editRequest}', [PropertyEditRequestController::class, 'destroy'])->name('property-edit-requests.destroy');
});

require __DIR__.'/auth.php';

// Debug route for testing Stripe configuration - REMOVE IN PRODUCTION
Route::get('/debug-stripe-config', function () {
    try {
        $settings = DB::table('admin_settings')
            ->whereIn('key_name', [
                'stripe_publishable_key', 
                'stripe_secret_key', 
                'contact_purchase_price', 
                'payment_currency'
            ])
            ->pluck('value', 'key_name');

        $stripeSettings = [
            'publishable_key' => $settings['stripe_publishable_key'] ?? 'NOT SET',
            'secret_key_exists' => !empty($settings['stripe_secret_key']),
            'secret_key_encrypted' => $settings['stripe_secret_key'] ?? 'NOT SET',
            'contact_price' => (float)($settings['contact_purchase_price'] ?? 15.00),
            'currency' => strtolower($settings['payment_currency'] ?? 'eur'),
        ];

        // Try to decrypt secret key
        if (!empty($settings['stripe_secret_key'])) {
            try {
                $decryptedKey = Crypt::decryptString($settings['stripe_secret_key']);
                $stripeSettings['secret_key_decrypted'] = 'SUCCESS (length: ' . strlen($decryptedKey) . ')';
                $stripeSettings['secret_key_prefix'] = substr($decryptedKey, 0, 7) . '...';
            } catch (\Exception $e) {
                $stripeSettings['secret_key_decrypted'] = 'DECRYPT FAILED: ' . $e->getMessage();
            }
        }

        return response()->json($stripeSettings);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
})->middleware('auth');

// Debug payment endpoints
Route::get('/debug-payment/{propertyId}', function ($propertyId) {
    try {
        $user = Auth::user();
        $property = \App\Models\Property::findOrFail($propertyId);
        
        return response()->json([
            'user_type' => $user->type_utilisateur,
            'user_id' => $user->id,
            'property_id' => $property->id,
            'property_status' => $property->statut,
            'property_owner' => $property->proprietaire_id,
            'existing_purchase' => \App\Models\ContactPurchase::where('agent_id', $user->id)
                ->where('property_id', $property->id)
                ->exists(),
            'stripe_configured' => !empty(DB::table('admin_settings')
                ->where('key_name', 'stripe_secret_key')
                ->value('value')),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware(['auth', 'agent']);

// Simple payment confirmation test
Route::post('/debug-payment-confirm', function (\Illuminate\Http\Request $request) {
    try {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'message' => 'Debug payment confirmation working',
            'user_id' => $user->id,
            'request_data' => $request->all(),
            'timestamp' => now()->toISOString(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware(['auth', 'agent']);

// Generate missing invoices route
Route::get('/admin/generate-missing-invoices', function () {
    try {
        // Find all successful purchases without invoices
        $purchasesWithoutInvoices = \App\Models\ContactPurchase::with(['agent', 'property'])
            ->where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
            ->whereDoesntHave('invoice')
            ->get();

        $generated = 0;
        $errors = [];

        foreach ($purchasesWithoutInvoices as $purchase) {
            try {
                $invoice = $purchase->generateInvoice();
                if ($invoice) {
                    $generated++;
                }
            } catch (\Exception $e) {
                $errors[] = "Purchase {$purchase->id}: " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Generated {$generated} missing invoices",
            'purchases_without_invoices' => $purchasesWithoutInvoices->count(),
            'generated' => $generated,
            'errors' => $errors,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware(['auth', 'admin']);

// Email testing routes (only in development)
if (app()->environment('local')) {
    Route::get('/test-welcome-email/{email?}', function ($email = null) {
        $email = $email ?: 'test@example.com';
        
        try {
            // Create a test user
            $testUser = new \App\Models\User([
                'prenom' => 'Test',
                'nom' => 'Agent',
                'email' => $email,
                'type_utilisateur' => 'AGENT',
                'est_verifie' => false,
                'created_at' => now()
            ]);
            
            // Send welcome email
            Mail::send('emails.welcome', ['user' => $testUser], function ($message) use ($email) {
                $message->to($email)
                        ->subject('Bienvenue sur Proprio Link ! - Test');
            });
            
            return response()->json([
                'success' => true,
                'message' => "Welcome email sent successfully to {$email}!",
                'note' => 'Check your Mailtrap inbox at https://mailtrap.io',
                'timestamp' => now()->format('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'note' => 'Make sure your Mailtrap credentials are correct in .env file'
            ], 500);
        }
    })->name('test.welcome.email');

    // Test admin notification emails
    Route::get('/test-admin-emails/{type?}', function ($type = 'registration') {
        try {
            $user = \App\Models\User::first();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'No users found in database'
                ]);
            }

            switch ($type) {
                case 'registration':
                    \App\Services\AdminNotificationService::notifyAdmins(
                        new \App\Mail\AdminUserRegistered($user)
                    );
                    $message = 'Admin registration notification sent';
                    break;
                    
                case 'password-reset':
                    $resetUrl = route('password.reset', ['token' => 'test-token', 'email' => $user->email]);
                    \App\Services\AdminNotificationService::notifyAdmins(
                        new \App\Mail\AdminPasswordResetRequest($user, $resetUrl)
                    );
                    $message = 'Admin password reset notification sent';
                    break;
                    
                case 'contact-purchase':
                    $purchase = \App\Models\ContactPurchase::with(['agent', 'property.proprietaire'])->first();
                    if (!$purchase) {
                        return response()->json([
                            'success' => false,
                            'error' => 'No contact purchases found in database'
                        ]);
                    }
                    \App\Services\AdminNotificationService::notifyAdmins(
                        new \App\Mail\AdminContactPurchased($purchase)
                    );
                    $message = 'Admin contact purchase notification sent';
                    break;
                    
                case 'property-created':
                    $property = \App\Models\Property::with('proprietaire')->first();
                    if (!$property) {
                        return response()->json([
                            'success' => false,
                            'error' => 'No properties found in database'
                        ]);
                    }
                    \App\Services\AdminNotificationService::notifyAdmins(
                        new \App\Mail\AdminPropertyCreated($property)
                    );
                    $message = 'Admin property creation notification sent';
                    break;
                    
                case 'property-approved':
                    $property = \App\Models\Property::with('proprietaire')->where('statut', 'PUBLIE')->first();
                    if (!$property) {
                        return response()->json([
                            'success' => false,
                            'error' => 'No published properties found in database'
                        ]);
                    }
                    \App\Services\AdminNotificationService::notifyAdmins(
                        new \App\Mail\AdminPropertyApproved($property)
                    );
                    $message = 'Admin property approval notification sent';
                    break;
                    
                default:
                    return response()->json([
                        'success' => false,
                        'error' => 'Invalid type. Use: registration, password-reset, contact-purchase, property-created, property-approved'
                    ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => $message,
                'admin_emails' => \App\Services\AdminNotificationService::getAdminEmails(),
                'timestamp' => now()->format('Y-m-d H:i:s')
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    })->name('test.admin.emails');
}

// Admin Email Settings Routes
Route::get('/admin/email-settings', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'index'])
    ->name('admin.email-settings');

Route::post('/admin/email-settings/smtp', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'updateSmtp'])
    ->name('admin.email-settings.update-smtp');

Route::post('/admin/email-settings/notification-emails', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'updateNotificationEmails'])
    ->name('admin.email-settings.update-notification-emails');

Route::post('/admin/email-settings/test-email', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'testEmail'])
    ->name('admin.email-settings.test-email');

Route::post('/admin/email-settings/test-admin-notification', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'testAdminNotification'])
    ->name('admin.email-settings.test-admin-notification');

Route::post('/admin/email-settings/website-url', [\App\Http\Controllers\Admin\AdminEmailSettingsController::class, 'updateWebsiteUrl'])
    ->name('admin.email-settings.update-website-url');

// Main application routes
Route::middleware('auth')->group(function () {
    // Dashboard route
    Route::get('/', function () {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Redirect based on user type
        switch ($user->type_utilisateur) {
            case 'AGENT':
                return redirect()->route('agent.dashboard');
            case 'ADMIN':
                return redirect()->route('admin.dashboard');
            case 'PROPRIETAIRE':
            default:
                return redirect()->route('dashboard');
        }
    })->name('home');
    
    // Property owner dashboard
    Route::get('/dashboard', function () {
        $user = Auth::user();
        
        \Log::info('Dashboard - Final Route Hit', [
            'user_id' => $user->id,
            'user_type' => $user->type_utilisateur,
            'user_email' => $user->email,
        ]);
        
        // Calculate stats for property owners
        $publishedProperties = Property::where('proprietaire_id', $user->id)
            ->where('statut', 'PUBLIE')
            ->count();
        
        $totalRevenue = ContactPurchase::whereHas('property', function ($query) use ($user) {
                $query->where('proprietaire_id', $user->id);
            })
            ->sum('montant_paye') ?? 0;
        
        $contactsSold = ContactPurchase::whereHas('property', function ($query) use ($user) {
                $query->where('proprietaire_id', $user->id);
            })
            ->count();
        
        $propertyViews = Property::where('proprietaire_id', $user->id)
            ->sum('views') ?? 0;
        
        $stats = [
            'published_properties' => $publishedProperties,
            'total_revenue' => $totalRevenue,
            'contacts_sold' => $contactsSold,
            'property_views' => $propertyViews,
            'debug_user_id' => $user->id,
            'debug_user_type' => $user->type_utilisateur,
        ];
        
        \Log::info('Dashboard - Final Stats', $stats);
        
        return Inertia::render('Dashboard', [
            'user' => $user,
            'properties' => $user->properties()->latest()->take(5)->get(),
            'stats' => $stats,
        ]);
    })->name('dashboard');
    
    // Agent dashboard
    Route::get('/agent/dashboard', function () {
        $user = Auth::user();
        
        // Get total count of available properties (published properties that are not owned by this agent)
        $availablePropertiesCount = Property::where('statut', 'PUBLIE')
            ->where('proprietaire_id', '!=', $user->id)
            ->count();
        
        // Get a sample of available properties for display
        $availableProperties = Property::where('statut', 'PUBLIE')
            ->where('proprietaire_id', '!=', $user->id)
            ->latest()
            ->take(10)
            ->get();
            
        // Get agent's purchase history and statistics
        $purchaseHistory = $user->contactPurchases()->latest()->get();
        $totalPurchases = $purchaseHistory->count();
        $totalSpent = $purchaseHistory->sum('montant_paye') ?? 0;
        
        return Inertia::render('Agent/Dashboard', [
            'user' => $user,
            'properties' => $availableProperties,
            'purchaseHistory' => $purchaseHistory,
            'stats' => [
                'available_properties' => $availablePropertiesCount,
                'total_purchases' => $totalPurchases,
                'total_spent' => $totalSpent,
                'recent_purchases' => $purchaseHistory->take(5)->count(),
            ],
        ]);
    })->name('agent.dashboard');
});

// Guest route - redirect to login
Route::get('/', function () {
    return redirect()->route('login');
})->middleware('guest');

// Set user language to French and test translations
Route::get('/set-french', function () {
    $user = Auth::user();
    if($user) {
        $user->language = 'fr';
        $user->save();
        
        // Clear translation cache
        \App\Http\Middleware\HandleInertiaRequests::clearTranslationCache();
        
        return response()->json([
            'success' => true,
            'message' => 'User language set to French',
            'user_language' => $user->language,
            'app_locale' => app()->getLocale(),
            'test_translations' => [
                'Contact Purchased' => __('Contact Purchased'),
                'Back to Properties' => __('Back to Properties'),
                'You have access to complete owner information' => __('You have access to complete owner information')
            ]
        ]);
    }
    
    return response()->json(['error' => 'Not authenticated']);
})->middleware('auth');

// Test Ethereal email configuration
Route::get('/test-ethereal-email', function () {
    try {
        $testEmail = 'test@example.com'; // You can change this to any test email
        
        // Send a simple test email
        Mail::raw('This is a test email from Proprio Link using Ethereal Email!', function ($message) use ($testEmail) {
            $message->to($testEmail)
                    ->subject('Test Email - Proprio Link');
        });
        
        return response()->json([
            'success' => true,
            'message' => 'Test email sent successfully via Ethereal!',
            'config' => [
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'username' => config('mail.mailers.smtp.username'),
                'encryption' => config('mail.mailers.smtp.encryption'),
            ],
            'sent_to' => $testEmail,
            'ethereal_inbox' => 'Check: https://ethereal.email/messages'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'config' => [
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'username' => config('mail.mailers.smtp.username'),
                'encryption' => config('mail.mailers.smtp.encryption'),
            ]
        ], 500);
    }
})->middleware('auth');

// Debug admin dashboard data
Route::get('/debug-admin-dashboard-json', function () {
    $stats = [
        'properties_pending' => \App\Models\Property::where('statut', \App\Models\Property::STATUT_EN_ATTENTE)->count(),
        'properties_published' => \App\Models\Property::where('statut', \App\Models\Property::STATUT_PUBLIE)->count(),
        'properties_rejected' => \App\Models\Property::where('statut', \App\Models\Property::STATUT_REJETE)->count(),
        'total_users' => \App\Models\User::count(),
        'agents_unverified' => \App\Models\User::where('type_utilisateur', 'AGENT')
                                  ->where('est_verifie', false)
                                  ->count(),
        
        'total_earnings' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
            ->sum('montant_paye'),
        'earnings_this_month' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
            ->whereMonth('paiement_confirme_a', now()->month)
            ->whereYear('paiement_confirme_a', now()->year)
            ->sum('montant_paye'),
        'total_transactions' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)->count(),
        'transactions_this_month' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
            ->whereMonth('paiement_confirme_a', now()->month)
            ->whereYear('paiement_confirme_a', now()->year)
            ->count(),
    ];
    
    $recentProperties = \App\Models\Property::with(['proprietaire', 'images'])
        ->where('statut', \App\Models\Property::STATUT_EN_ATTENTE)
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();
    
    return response()->json([
        'stats' => $stats,
        'recentProperties' => $recentProperties,
        'debug_info' => [
            'property_en_attente_constant' => \App\Models\Property::STATUT_EN_ATTENTE,
            'contact_purchase_succeeded_constant' => \App\Models\ContactPurchase::STATUS_SUCCEEDED,
            'actual_pending_count' => \App\Models\Property::where('statut', 'EN_ATTENTE')->count(),
            'actual_succeeded_purchases' => \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->count(),
        ]
    ]);
})->middleware(['auth', 'admin']);

// Debug route to test property emails
Route::get('/test-property-emails', function () {
    try {
        $property = \App\Models\Property::with('proprietaire')->first();
        
        if (!$property || !$property->proprietaire) {
            return response()->json(['error' => 'No property with owner found']);
        }
        
        // Test PropertyRejectedMail
        \Mail::to($property->proprietaire->email)->send(new \App\Mail\PropertyRejectedMail($property));
        
        // Test PropertyDeletedMail
        \Mail::to($property->proprietaire->email)->send(new \App\Mail\PropertyDeletedMail($property, 'Test deletion reason'));
        
        return response()->json([
            'success' => true,
            'message' => 'Test emails sent to: ' . $property->proprietaire->email,
            'property_id' => $property->id
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to send emails: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
})->middleware('auth');

// =============================================================
// ADMIN PENDING PROPERTIES DIAGNOSTIC ROUTES
// =============================================================

// Diagnostic route to check admin pending properties status
Route::get('/admin-diagnostic', function () {
    try {
        $diagnostics = [
            'database_connected' => true,
            'total_properties' => \App\Models\Property::count(),
            'pending_properties' => \App\Models\Property::where('statut', 'EN_ATTENTE')->count(),
            'published_properties' => \App\Models\Property::where('statut', 'PUBLIE')->count(),
            'rejected_properties' => \App\Models\Property::where('statut', 'REJETE')->count(),
            'sold_properties' => \App\Models\Property::where('statut', 'VENDU')->count(),
            'current_user' => Auth::user() ? [
                'id' => Auth::user()->id,
                'email' => Auth::user()->email,
                'type' => Auth::user()->type_utilisateur,
                'is_admin' => Auth::user()->type_utilisateur === 'ADMIN',
            ] : 'Not authenticated',
            'sample_properties' => \App\Models\Property::select('id', 'ville', 'statut', 'created_at', 'type_propriete')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'property_status_constants' => [
                'EN_ATTENTE' => \App\Models\Property::STATUT_EN_ATTENTE,
                'PUBLIE' => \App\Models\Property::STATUT_PUBLIE,
                'REJETE' => \App\Models\Property::STATUT_REJETE,
                'VENDU' => \App\Models\Property::STATUT_VENDU,
            ],
        ];
        
        // Test the exact query from ModerationController
        $controllerQuery = \App\Models\Property::with(['proprietaire', 'images'])
            ->where('statut', \App\Models\Property::STATUT_EN_ATTENTE)
            ->orderBy('created_at', 'asc');
            
        $diagnostics['controller_simulation'] = [
            'query_sql' => $controllerQuery->toSql(),
            'query_count' => $controllerQuery->count(),
            'query_results' => $controllerQuery->limit(5)->get()->map(function($p) {
                return [
                    'id' => $p->id,
                    'ville' => $p->ville,
                    'statut' => $p->statut,
                    'created_at' => $p->created_at->format('Y-m-d H:i:s'),
                    'owner_exists' => $p->proprietaire ? true : false,
                ];
            }),
        ];
        
        return response()->json($diagnostics, 200, [], JSON_PRETTY_PRINT);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Diagnostic failed',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500, [], JSON_PRETTY_PRINT);
    }
})->middleware(['auth'])->name('admin.diagnostic');

// Route to create test pending properties
Route::get('/create-test-pending-properties', function () {
    try {
        $user = Auth::user();
        if (!$user || $user->type_utilisateur !== 'ADMIN') {
            return response()->json(['error' => 'Must be logged in as admin'], 403);
        }
        
        // Find or create a property owner
        $proprietaire = \App\Models\User::where('type_utilisateur', 'PROPRIETAIRE')->first();
        
        if (!$proprietaire) {
            $proprietaire = \App\Models\User::create([
                'prenom' => 'Test',
                'nom' => 'Owner',
                'email' => 'testowner@propio.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'type_utilisateur' => 'PROPRIETAIRE',
                'est_verifie' => true,
                'language' => 'fr',
            ]);
        }
        
        // Create test pending properties
        $testProperties = [];
        $cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
        $types = ['APPARTEMENT', 'MAISON', 'TERRAIN', 'COMMERCIAL', 'BUREAU'];
        
        for ($i = 1; $i <= 5; $i++) {
            $city = $cities[array_rand($cities)];
            $type = $types[array_rand($types)];
            
            $property = \App\Models\Property::create([
                'proprietaire_id' => $proprietaire->id,
                'adresse_complete' => "Block $i, Test Area, $city",
                'pays' => 'Pakistan',
                'ville' => $city,
                'prix' => rand(2000000, 15000000), // 2M to 15M PKR
                'superficie_m2' => rand(80, 300),
                'type_propriete' => $type,
                'description' => "Test property $i requiring admin review and approval. This property has been submitted by the owner and is awaiting moderation.",
                'nombre_pieces' => rand(3, 6),
                'nombre_chambres' => rand(2, 4),
                'nombre_salles_bain' => rand(1, 3),
                'contacts_souhaites' => 5,
                'contacts_restants' => 5,
                'statut' => \App\Models\Property::STATUT_EN_ATTENTE, // This is the key!
                'created_at' => now()->subDays(rand(1, 7)), // Created in the last week
            ]);
            
            $testProperties[] = [
                'id' => $property->id,
                'ville' => $property->ville,
                'type_propriete' => $property->type_propriete,
                'statut' => $property->statut,
                'prix' => 'PKR ' . number_format($property->prix),
                'created_at' => $property->created_at->format('Y-m-d H:i:s'),
            ];
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Created 5 test pending properties',
            'owner_email' => $proprietaire->email,
            'properties' => $testProperties,
            'next_steps' => [
                '1. Visit /admin/dashboard to see the updated pending count',
                '2. Visit /admin/properties/pending to review the properties',
                '3. Test approving/rejecting properties',
                '4. Remove this route after testing',
            ],
        ], 200, [], JSON_PRETTY_PRINT);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to create test properties',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
})->middleware(['auth'])->name('create.test.pending.properties');

require __DIR__.'/auth.php';
