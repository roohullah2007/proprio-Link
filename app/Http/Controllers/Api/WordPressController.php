<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class WordPressController extends Controller
{
    /**
     * Get property types available in the system
     */
    public function getPropertyTypes(): JsonResponse
    {
        try {
            $propertyTypes = Cache::remember('wordpress_property_types', 3600, function () {
                return Property::select('type_propriete')
                    ->where('statut', Property::STATUT_PUBLIE)
                    ->where('contacts_restants', '>', 0)
                    ->distinct()
                    ->orderBy('type_propriete')
                    ->pluck('type_propriete')
                    ->filter()
                    ->values();
            });

            return response()->json([
                'success' => true,
                'data' => $propertyTypes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cities for autocomplete
     */
    public function getCities(Request $request): JsonResponse
    {
        try {
            $query = $request->get('q', '');
            
            $cities = Cache::remember("wordpress_cities_{$query}", 1800, function () use ($query) {
                $cityQuery = Property::select('ville')
                    ->where('statut', Property::STATUT_PUBLIE)
                    ->where('contacts_restants', '>', 0)
                    ->distinct();

                if ($query) {
                    $cityQuery->where('ville', 'LIKE', '%' . $query . '%');
                }

                return $cityQuery->orderBy('ville')
                    ->limit(10)
                    ->pluck('ville')
                    ->filter()
                    ->values();
            });

            return response()->json([
                'success' => true,
                'data' => $cities
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search properties for WordPress display
     */
    public function searchProperties(Request $request): JsonResponse
    {
        try {
            $query = Property::with(['images'])
                ->where('statut', Property::STATUT_PUBLIE)
                ->where('contacts_restants', '>', 0);

            // Apply search filters
            if ($request->filled('keyword')) {
                $keyword = $request->get('keyword');
                $query->where(function ($q) use ($keyword) {
                    $q->where('description', 'LIKE', '%' . $keyword . '%')
                      ->orWhere('ville', 'LIKE', '%' . $keyword . '%')
                      ->orWhere('adresse_complete', 'LIKE', '%' . $keyword . '%')
                      ->orWhere('pays', 'LIKE', '%' . $keyword . '%');
                });
            }

            if ($request->filled('property_type')) {
                $query->where('type_propriete', $request->get('property_type'));
            }

            if ($request->filled('city')) {
                $query->where('ville', 'LIKE', '%' . $request->get('city') . '%');
            }

            if ($request->filled('min_price')) {
                $query->where('prix', '>=', $request->get('min_price'));
            }

            if ($request->filled('max_price')) {
                $query->where('prix', '<=', $request->get('max_price'));
            }

            // Pagination
            $perPage = min($request->get('per_page', 12), 50); // Max 50 items per page
            $properties = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Get app URL from request or use default
            $appUrl = $request->get('app_url', 'http://localhost:8000');
            $appUrl = rtrim($appUrl, '/');

            // Format properties for WordPress
            $formattedProperties = $properties->getCollection()->map(function ($property) use ($appUrl) {
                return [
                    'id' => $property->id, // Use 'id' instead of 'uuid'
                    'title' => $property->type_propriete . ' - ' . $property->ville,
                    'description' => $property->description,
                    'price' => $property->prix,
                    'price_formatted' => '€' . number_format($property->prix, 0, ',', ' '),
                    'location' => $property->ville . ', ' . $property->pays,
                    'address' => $property->adresse_complete,
                    'type' => $property->type_propriete,
                    'surface' => $property->superficie_m2,
                    'surface_formatted' => $property->superficie_m2 . ' m²',
                    'contacts_remaining' => $property->contacts_restants,
                    'image' => $property->images->first() ? 
                        asset('storage/' . $property->images->first()->chemin_fichier) : null,
                    'detail_url' => $appUrl . '/property/' . $property->id, // Use configurable URL
                    'created_at' => $property->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedProperties,
                'pagination' => [
                    'current_page' => $properties->currentPage(),
                    'last_page' => $properties->lastPage(),
                    'per_page' => $properties->perPage(),
                    'total' => $properties->total(),
                    'from' => $properties->firstItem(),
                    'to' => $properties->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('WordPress Properties API Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Get featured properties for homepage display
     */
    public function getFeaturedProperties(Request $request): JsonResponse
    {
        try {
            $limit = min($request->get('limit', 6), 20); // Max 20 properties
            $appUrl = $request->get('app_url', 'http://localhost:8000');
            $appUrl = rtrim($appUrl, '/');
            
            $properties = Property::with(['images'])
                ->where('statut', Property::STATUT_PUBLIE)
                ->where('contacts_restants', '>', 0)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $formattedProperties = $properties->map(function ($property) use ($appUrl) {
                return [
                    'id' => $property->id, // Use 'id' instead of 'uuid'
                    'title' => $property->type_propriete . ' - ' . $property->ville,
                    'description' => $property->description,
                    'price' => $property->prix,
                    'price_formatted' => '€' . number_format($property->prix, 0, ',', ' '),
                    'location' => $property->ville . ', ' . $property->pays,
                    'type' => $property->type_propriete,
                    'surface' => $property->superficie_m2,
                    'surface_formatted' => $property->superficie_m2 . ' m²',
                    'image' => $property->images->first() ? 
                        asset('storage/' . $property->images->first()->chemin_fichier) : null,
                    'detail_url' => $appUrl . '/property/' . $property->id, // Use configurable URL
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedProperties
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get property statistics for WordPress display
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = Cache::remember('wordpress_stats', 1800, function () {
                return [
                    'total_properties' => Property::where('statut', Property::STATUT_PUBLIE)
                        ->where('contacts_restants', '>', 0)
                        ->count(),
                    'total_cities' => Property::where('statut', Property::STATUT_PUBLIE)
                        ->where('contacts_restants', '>', 0)
                        ->distinct('ville')
                        ->count('ville'),
                    'property_types' => Property::where('statut', Property::STATUT_PUBLIE)
                        ->where('contacts_restants', '>', 0)
                        ->select('type_propriete')
                        ->selectRaw('count(*) as count')
                        ->groupBy('type_propriete')
                        ->orderBy('count', 'desc')
                        ->get()
                        ->pluck('count', 'type_propriete'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
