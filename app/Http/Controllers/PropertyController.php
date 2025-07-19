<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Get public website settings
     */
    private function getPublicSettings()
    {
        $settings = [];
        
        try {
            $dbSettings = DB::table('admin_settings')
                ->whereIn('key_name', ['website_url', 'website_menu_links'])
                ->pluck('value', 'key_name');
            
            $settings['website_url'] = $dbSettings['website_url'] ?? 'https://yourdomain.com';
            $settings['website_menu_links'] = $dbSettings['website_menu_links'] ?? json_encode([]);
            
            // Parse JSON for menu links
            if (is_string($settings['website_menu_links'])) {
                $settings['website_menu_links'] = json_decode($settings['website_menu_links'], true) ?: [];
            }
        } catch (\Exception $e) {
            // Default settings if database error
            $settings = [
                'website_url' => 'https://yourdomain.com',
                'website_menu_links' => []
            ];
        }
        
        return $settings;
    }
    /**
     * Display the property submission form
     */
    public function create(): Response
    {
        return Inertia::render('Properties/Create');
    }

    /**
     * Display properties list for the authenticated user
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        $properties = Property::with(['images' => function($query) {
            $query->orderBy('ordre_affichage', 'asc');
        }])
            ->where('proprietaire_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        // Ensure images have proper URLs
        $properties->through(function ($property) {
            if ($property->images) {
                $property->images = $property->images->map(function ($image) {
                    $image->url = asset('storage/' . $image->chemin_fichier);
                    $image->chemin_image = asset('storage/' . $image->chemin_fichier);
                    return $image;
                });
            }
            return $property;
        });

        return Inertia::render('Properties/Index', [
            'properties' => $properties
        ]);
    }

    /**
     * Store a new property
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresse_complete' => 'required|string|max:500',
            'pays' => 'required|string|max:100',
            'ville' => 'required|string|max:100',
            'prix' => 'required|numeric|min:0|max:999999999.99',
            'superficie_m2' => 'required|integer|min:1|max:100000',
            'type_propriete' => 'required|in:APPARTEMENT,MAISON,TERRAIN,COMMERCIAL,BUREAU,AUTRES',
            'description' => 'nullable|string|max:2000',
            'nombre_pieces' => 'nullable|integer|min:1|max:50',
            'nombre_chambres' => 'nullable|integer|min:0|max:20',
            'nombre_salles_bain' => 'nullable|integer|min:0|max:10',
            'etage' => 'nullable|integer|min:-5|max:100',
            'annee_construction' => 'nullable|integer|min:1800|max:' . date('Y'),
            'etat_propriete' => 'nullable|in:NEUF,EXCELLENT,BON,A_RENOVER,A_RESTAURER',
            'type_chauffage' => 'nullable|in:GAZ,ELECTRIQUE,FIOUL,POMPE_CHALEUR,BOIS,COLLECTIF,AUTRE',
            'dpe_classe_energie' => 'nullable|in:A,B,C,D,E,F,G,NON_RENSEIGNE',
            'dpe_classe_ges' => 'nullable|in:A,B,C,D,E,F,G,NON_RENSEIGNE',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:100',
            'meuble' => 'boolean',
            'charges_mensuelles' => 'nullable|numeric|min:0|max:99999.99',
            'informations_complementaires' => 'nullable|string|max:1000',
            'contacts_souhaites' => 'required|integer|min:1|max:20',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image
        ]);

        $property = Property::create([
            'proprietaire_id' => Auth::id(),
            'adresse_complete' => $validated['adresse_complete'],
            'pays' => $validated['pays'],
            'ville' => $validated['ville'],
            'prix' => $validated['prix'],
            'superficie_m2' => $validated['superficie_m2'],
            'type_propriete' => $validated['type_propriete'],
            'description' => $validated['description'] ?? null,
            'nombre_pieces' => $validated['nombre_pieces'] ?? null,
            'nombre_chambres' => $validated['nombre_chambres'] ?? null,
            'nombre_salles_bain' => $validated['nombre_salles_bain'] ?? null,
            'etage' => $validated['etage'] ?? null,
            'annee_construction' => $validated['annee_construction'] ?? null,
            'etat_propriete' => $validated['etat_propriete'] ?? null,
            'type_chauffage' => $validated['type_chauffage'] ?? null,
            'dpe_classe_energie' => $validated['dpe_classe_energie'] ?? 'NON_RENSEIGNE',
            'dpe_classe_ges' => $validated['dpe_classe_ges'] ?? 'NON_RENSEIGNE',
            'amenities' => $validated['amenities'] ?? [],
            'meuble' => $validated['meuble'] ?? false,
            'charges_mensuelles' => $validated['charges_mensuelles'] ?? null,
            'informations_complementaires' => $validated['informations_complementaires'] ?? null,
            'contacts_souhaites' => $validated['contacts_souhaites'],
            'contacts_restants' => $validated['contacts_souhaites'],
            'statut' => Property::STATUT_EN_ATTENTE,
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            $this->uploadPropertyImages($property, $request->file('images'));
        }

        // Send property listing confirmation email
        try {
            \Mail::to($property->proprietaire)->send(new \App\Mail\PropertyListedForReview($property));
        } catch (\Exception $e) {
            \Log::error('Failed to send property listing email: ' . $e->getMessage());
        }

        // Get current locale for success message
        $locale = app()->getLocale();
        
        // Load translations for success messages
        $translationsPath = lang_path($locale . '.json');
        $translations = [];
        if (file_exists($translationsPath)) {
            $translations = json_decode(file_get_contents($translationsPath), true) ?? [];
        }
        
        // Get translated messages
        if ($locale === 'en') {
            $message = $translations['Property successfully created!'] ?? 'Property successfully created!';
            $description = $translations['Your property has been submitted and is pending review.'] ?? 'Your property has been submitted and is pending review.';
        } else {
            $message = $translations['Property successfully created!'] ?? 'Propriété créée avec succès!';
            $description = $translations['Your property has been submitted and is pending review.'] ?? 'Votre propriété a été soumise et est en attente d\'examen.';
        }

        return redirect()->route('properties.index')
            ->with('success', $message)
            ->with('success_description', $description);
    }

    /**
     * Show property details
     */
    public function show(Property $property): Response
    {
        // Check if user owns this property or is admin
        if ($property->proprietaire_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        // If user is admin, redirect to admin property view
        if (Auth::user()->isAdmin()) {
            return $this->adminShow($property);
        }

        $property->load(['images', 'proprietaire', 'editRequests.requestedBy']);

        return Inertia::render('Properties/Show', [
            'property' => $property,
            'editRequests' => $property->editRequests->sortByDesc('created_at')->values(),
        ]);
    }

    /**
     * Show property details for admin users
     */
    public function adminShow(Property $property): Response
    {
        $property->load(['images', 'proprietaire', 'editRequests.requestedBy']);

        return Inertia::render('Admin/PropertyView', [
            'property' => $property,
            'editRequests' => $property->editRequests->sortByDesc('created_at')->values(),
        ]);
    }

    /**
     * Show edit form for property
     */
    public function edit(Property $property): Response
    {
        // Check ownership
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403);
        }

        $property->load(['images']);

        return Inertia::render('Properties/Edit', [
            'property' => $property
        ]);
    }

    /**
     * Update property
     */
    public function update(Request $request, Property $property)
    {
        // Check ownership
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403);
        }

        // Only allow updates if property is not published
        if ($property->statut === Property::STATUT_PUBLIE) {
            return back()->with('error', __('Impossible de modifier une propriété déjà publiée.'));
        }

        $validated = $request->validate([
            'adresse_complete' => 'required|string|max:500',
            'pays' => 'required|string|max:100',
            'ville' => 'required|string|max:100',
            'prix' => 'required|numeric|min:0|max:999999999.99',
            'superficie_m2' => 'required|integer|min:1|max:100000',
            'type_propriete' => 'required|in:APPARTEMENT,MAISON,TERRAIN,COMMERCIAL,BUREAU,AUTRES',
            'description' => 'nullable|string|max:2000',
            'nombre_pieces' => 'nullable|integer|min:1|max:50',
            'nombre_chambres' => 'nullable|integer|min:0|max:20',
            'nombre_salles_bain' => 'nullable|integer|min:0|max:10',
            'etage' => 'nullable|integer|min:-5|max:100',
            'annee_construction' => 'nullable|integer|min:1800|max:' . date('Y'),
            'etat_propriete' => 'nullable|in:NEUF,EXCELLENT,BON,A_RENOVER,A_RESTAURER',
            'type_chauffage' => 'nullable|in:GAZ,ELECTRIQUE,FIOUL,POMPE_CHALEUR,BOIS,COLLECTIF,AUTRE',
            'dpe_classe_energie' => 'nullable|in:A,B,C,D,E,F,G,NON_RENSEIGNE',
            'dpe_classe_ges' => 'nullable|in:A,B,C,D,E,F,G,NON_RENSEIGNE',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:100',
            'meuble' => 'boolean',
            'charges_mensuelles' => 'nullable|numeric|min:0|max:99999.99',
            'informations_complementaires' => 'nullable|string|max:1000',
            'contacts_souhaites' => 'required|integer|min:1|max:20',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max per image
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'string', // UUIDs of images to remove
        ]);

        // Update property basic data
        $property->update([
            'adresse_complete' => $validated['adresse_complete'],
            'pays' => $validated['pays'],
            'ville' => $validated['ville'],
            'prix' => $validated['prix'],
            'superficie_m2' => $validated['superficie_m2'],
            'type_propriete' => $validated['type_propriete'],
            'description' => $validated['description'] ?? null,
            'nombre_pieces' => $validated['nombre_pieces'] ?? null,
            'nombre_chambres' => $validated['nombre_chambres'] ?? null,
            'nombre_salles_bain' => $validated['nombre_salles_bain'] ?? null,
            'etage' => $validated['etage'] ?? null,
            'annee_construction' => $validated['annee_construction'] ?? null,
            'etat_propriete' => $validated['etat_propriete'] ?? null,
            'type_chauffage' => $validated['type_chauffage'] ?? null,
            'dpe_classe_energie' => $validated['dpe_classe_energie'] ?? 'NON_RENSEIGNE',
            'dpe_classe_ges' => $validated['dpe_classe_ges'] ?? 'NON_RENSEIGNE',
            'amenities' => $validated['amenities'] ?? [],
            'meuble' => $validated['meuble'] ?? false,
            'charges_mensuelles' => $validated['charges_mensuelles'] ?? null,
            'informations_complementaires' => $validated['informations_complementaires'] ?? null,
            'contacts_souhaites' => $validated['contacts_souhaites'],
        ]);

        // Handle image removals
        if ($request->has('remove_images') && is_array($request->remove_images)) {
            $imagesToRemove = PropertyImage::where('property_id', $property->id)
                ->whereIn('id', $request->remove_images)
                ->get();
            
            foreach ($imagesToRemove as $image) {
                // Delete file from storage
                Storage::disk('public')->delete($image->chemin_fichier);
                // Delete database record
                $image->delete();
            }
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $existingImagesCount = $property->images()->count();
            $this->uploadPropertyImages($property, $request->file('images'), $existingImagesCount);
        }

        // Get current locale for success message
        $locale = app()->getLocale();
        
        // Load translations for success messages
        $translationsPath = lang_path($locale . '.json');
        $translations = [];
        if (file_exists($translationsPath)) {
            $translations = json_decode(file_get_contents($translationsPath), true) ?? [];
        }
        
        // Get translated messages
        if ($locale === 'en') {
            $message = $translations['Property successfully updated!'] ?? 'Property successfully updated!';
            $description = $translations['Your property changes have been saved successfully.'] ?? 'Your property changes have been saved successfully.';
        } else {
            $message = $translations['Property successfully updated!'] ?? 'Propriété mise à jour avec succès!';
            $description = $translations['Your property changes have been saved successfully.'] ?? 'Les modifications de votre propriété ont été enregistrées avec succès.';
        }

        return redirect()->route('properties.index')
            ->with('success', $message)
            ->with('success_description', $description);
    }

    /**
     * Delete property
     */
    public function destroy(Property $property)
    {
        // Check ownership
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403);
        }

        // Delete associated images from storage
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->chemin_fichier);
        }

        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', __('Propriété supprimée avec succès.'));
    }

    /**
     * Upload and store property images
     */
    private function uploadPropertyImages(Property $property, array $images, int $startIndex = 0)
    {
        foreach ($images as $index => $image) {
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('properties/' . $property->id, $filename, 'public');

            // FALLBACK: Also copy to public directory if symlink doesn't work
            $sourcePath = storage_path('app/public/' . $path);
            $publicPath = public_path('storage/' . $path);
            $publicDir = dirname($publicPath);
            
            if (!file_exists($publicDir)) {
                mkdir($publicDir, 0755, true);
            }
            
            if (file_exists($sourcePath) && !file_exists($publicPath)) {
                copy($sourcePath, $publicPath);
            }

            PropertyImage::create([
                'property_id' => $property->id,
                'nom_fichier' => $image->getClientOriginalName(),
                'chemin_fichier' => $path,
                'ordre_affichage' => $startIndex + $index,
            ]);
        }
    }

    /**
     * Add new images to existing property
     */
    public function addImages(Request $request, Property $property)
    {
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('images')) {
            $existingImagesCount = $property->images()->count();
            $this->uploadPropertyImages($property, $request->file('images'));
        }

        return back()->with('success', __('Images ajoutées avec succès.'));
    }

    /**
     * Delete property image
     */
    public function deleteImage(PropertyImage $image)
    {
        $property = $image->property;
        
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403);
        }

        // Delete file from storage
        Storage::disk('public')->delete($image->chemin_fichier);
        
        // FALLBACK: Also delete from public directory if it exists
        $publicPath = public_path('storage/' . $image->chemin_fichier);
        if (file_exists($publicPath)) {
            unlink($publicPath);
        }
        
        // Delete database record
        $image->delete();

        return back()->with('success', __('Image supprimée avec succès.'));
    }

    /**
     * Public property detail page for external access
     */
    public function showPublic(Property $property): Response
    {
        // Check if user is admin - admins can view any property
        $isAdmin = Auth::check() && Auth::user()->isAdmin();
        
        // Only show published properties with remaining contacts, unless user is admin
        if (!$isAdmin && ($property->statut !== Property::STATUT_PUBLIE || $property->contacts_restants <= 0)) {
            abort(404);
        }

        // Load relationships
        $property->load(['images', 'proprietaire']);

        // Get property types for display
        $propertyTypes = [
            'APPARTEMENT' => __('Apartment'),
            'MAISON' => __('House'),
            'TERRAIN' => __('Land'),
            'COMMERCIAL' => __('Commercial'),
            'BUREAU' => __('Office'),
            'AUTRES' => __('Other'),
        ];

        // Get similar properties (same type, nearby location, similar price range)
        $similarProperties = Property::with(['images'])
            ->where('statut', Property::STATUT_PUBLIE)
            ->where('contacts_restants', '>', 0)
            ->where('id', '!=', $property->id)
            ->where('type_propriete', $property->type_propriete)
            ->where('ville', $property->ville)
            ->whereBetween('prix', [
                $property->prix * 0.7, // 30% below
                $property->prix * 1.3  // 30% above
            ])
            ->orderByDesc('created_at')
            ->take(4)
            ->get();

        // If no similar properties in same city, get from same country
        if ($similarProperties->count() < 4) {
            $additionalProperties = Property::with(['images'])
                ->where('statut', Property::STATUT_PUBLIE)
                ->where('contacts_restants', '>', 0)
                ->where('id', '!=', $property->id)
                ->where('type_propriete', $property->type_propriete)
                ->where('pays', $property->pays)
                ->where('ville', '!=', $property->ville)
                ->orderByDesc('created_at')
                ->take(4 - $similarProperties->count())
                ->get();
                
            $similarProperties = $similarProperties->merge($additionalProperties);
        }

        return Inertia::render('Property/PublicDetail', [
            'property' => $property,
            'propertyTypes' => $propertyTypes,
            'similarProperties' => $similarProperties,
            'locale' => app()->getLocale(),
            'settings' => $this->getPublicSettings(),
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Public property search page
     */
    public function publicSearch(Request $request): Response
    {
        $query = Property::with(['images'])
            ->where('statut', Property::STATUT_PUBLIE)
            ->where('contacts_restants', '>', 0);

        // Apply search filters
        if ($request->filled('search_term')) {
            $searchTerm = $request->search_term;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('description', 'like', "%{$searchTerm}%")
                  ->orWhere('ville', 'like', "%{$searchTerm}%")
                  ->orWhere('adresse_complete', 'like', "%{$searchTerm}%")
                  ->orWhere('pays', 'like', "%{$searchTerm}%")
                  ->orWhere('type_propriete', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('property_type')) {
            $query->where('type_propriete', strtoupper($request->property_type));
        }

        if ($request->filled('min_price')) {
            $query->where('prix', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('prix', '<=', $request->max_price);
        }

        if ($request->filled('city')) {
            $query->where('ville', 'like', "%{$request->city}%");
        }

        // Default sorting by newest first
        $query->orderByDesc('created_at');

        // Paginate results
        $properties = $query->paginate(12)->withQueryString();

        // Get property types for filters
        $propertyTypes = [
            'appartement' => __('Apartment'),
            'maison' => __('House'),
            'villa' => __('Villa'),
            'studio' => __('Studio'),
            'terrain' => __('Land'),
            'commercial' => __('Commercial'),
            'bureau' => __('Office'),
        ];

        // Get cities for filter
        $cities = Property::where('statut', Property::STATUT_PUBLIE)
            ->where('contacts_restants', '>', 0)
            ->distinct()
            ->pluck('ville')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('Property/PublicSearch', [
            'properties' => $properties,
            'propertyTypes' => $propertyTypes,
            'cities' => $cities,
            'filters' => $request->only(['search_term', 'property_type', 'min_price', 'max_price', 'city']),
            'locale' => app()->getLocale(),
            'settings' => $this->getPublicSettings(),
        ]);
    }
}
