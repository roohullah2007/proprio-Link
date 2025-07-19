<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\Admin\ModerationController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\SettingsController;
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
        <title>Storage Admin - Propio</title>
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
        <h1>Storage Admin - Propio</h1>
        
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

Route::get('/dashboard', function () {
    $user = Auth::user();
    
    // Check if user needs email verification first
    if ($user && !$user->hasVerifiedEmail()) {
        return redirect()->route('verification.notice');
    }
    
    // Redirect based on user type for verified users
    if ($user) {
        switch ($user->type_utilisateur) {
            case 'AGENT':
                return redirect()->route('agent.dashboard');
            case 'ADMIN':
                return redirect()->route('admin.dashboard');
            case 'PROPRIETAIRE':
            default:
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
                
                $propertyViews = 0; // Property views tracking not implemented yet
                
                $stats = [
                    'published_properties' => $publishedProperties,
                    'total_revenue' => $totalRevenue,
                    'contacts_sold' => $contactsSold,
                    'property_views' => $propertyViews,
                ];
                
                return Inertia::render('Dashboard', [
                    'stats' => $stats,
                ]);
        }
    }
    
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

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
    // Check verification for admin dashboard
    Route::get('/dashboard', function () {
        if (!Auth::user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }
        return app(ModerationController::class)->dashboard();
    })->name('dashboard');
    
    // Properties Management
    Route::get('/properties/pending', [ModerationController::class, 'pendingProperties'])->name('pending-properties');
    Route::get('/properties/all', [ModerationController::class, 'allProperties'])->name('all-properties');
    Route::get('/properties/{property}/review', [ModerationController::class, 'showProperty'])->name('property-review');
    Route::post('/properties/{property}/approve', [ModerationController::class, 'approveProperty'])->name('approve-property');
    Route::post('/properties/{property}/reject', [ModerationController::class, 'rejectProperty'])->name('reject-property');
    Route::post('/properties/{property}/pending', [ModerationController::class, 'pendingProperty'])->name('pending-property');
    Route::post('/properties/{property}/sold', [ModerationController::class, 'markAsSold'])->name('mark-sold');
    Route::post('/properties/bulk-approve', [ModerationController::class, 'bulkApprove'])->name('bulk-approve');
    
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

require __DIR__.'/auth.php';
