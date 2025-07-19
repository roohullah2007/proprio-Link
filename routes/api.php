<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WordPressController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Simple test route
Route::get('test', function() {
    return response()->json(['message' => 'API is working!', 'time' => now()]);
});

// Debug route for WordPress API
Route::get('debug/wordpress', function() {
    try {
        // Test database connection
        $propertyCount = \App\Models\Property::count();
        
        // Test property types
        $propertyTypes = \App\Models\Property::select('type_propriete')
            ->distinct()
            ->pluck('type_propriete')
            ->filter()
            ->values();
            
        return response()->json([
            'success' => true,
            'debug' => [
                'database_connected' => true,
                'total_properties' => $propertyCount,
                'property_types' => $propertyTypes,
                'published_properties' => \App\Models\Property::where('statut', 'PUBLIE')->count(),
                'controller_exists' => class_exists(\App\Http\Controllers\Api\WordPressController::class),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// WordPress Plugin API Routes (No authentication required for public data)
Route::prefix('wordpress')->name('wordpress.')->group(function () {
    Route::get('property-types', [WordPressController::class, 'getPropertyTypes'])->name('property-types');
    Route::get('cities', [WordPressController::class, 'getCities'])->name('cities');
    Route::get('properties', [WordPressController::class, 'searchProperties'])->name('properties');
    Route::get('featured', [WordPressController::class, 'getFeaturedProperties'])->name('featured');
    Route::get('stats', [WordPressController::class, 'getStats'])->name('stats');
});

// Rate limiting for WordPress API
Route::middleware(['throttle:wordpress'])->group(function () {
    // Apply rate limits if needed
});

