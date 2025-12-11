<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    use HasFactory, HasUuids;

    /**
     * The "type" of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'property_id',
        'nom_fichier',
        'chemin_fichier',
        'chemin_image',
        'ordre_affichage',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ordre_affichage' => 'integer',
        ];
    }

    /**
     * The attributes that should be appended to the model's array form.
     */
    protected $appends = ['url'];

    /**
     * Relationship with property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the full URL for the image with multiple fallbacks
     */
    public function getUrlAttribute(): string
    {
        if (!$this->chemin_fichier) {
            return $this->getPlaceholderUrl();
        }

        // Try storage URL first
        if (\Storage::disk('public')->exists($this->chemin_fichier)) {
            return asset('storage/' . $this->chemin_fichier);
        }

        // Fallback to direct file serving route if route exists
        if (\Route::has('serve.image')) {
            return route('serve.image', $this->chemin_fichier);
        }

        // Final fallback to asset path
        return asset('storage/' . $this->chemin_fichier);
    }

    /**
     * Get multiple URL options for frontend fallback handling
     */
    public function getImageUrls(): array
    {
        if (!$this->chemin_fichier) {
            return [
                'primary' => $this->getPlaceholderUrl(),
                'fallbacks' => []
            ];
        }

        $urls = [
            asset('storage/' . $this->chemin_fichier),
            asset('images/' . basename($this->chemin_fichier))
        ];

        // Add route-based fallbacks if routes exist
        if (\Route::has('serve.image')) {
            $urls[] = route('serve.image', $this->chemin_fichier);
        }
        if (\Route::has('serve.storage')) {
            $urls[] = route('serve.storage', $this->chemin_fichier);
        }

        return [
            'primary' => $urls[0],
            'fallbacks' => array_slice($urls, 1)
        ];
    }

    /**
     * Get placeholder image URL
     */
    private function getPlaceholderUrl(): string
    {
        return 'data:image/svg+xml;base64,' . base64_encode('
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f3f4f6"/>
                <rect x="80" y="75" width="240" height="150" fill="#e5e7eb"/>
                <rect x="100" y="95" width="80" height="60" fill="#d1d5db"/>
                <rect x="220" y="95" width="80" height="60" fill="#d1d5db"/>
                <rect x="100" y="170" width="200" height="40" fill="#d1d5db"/>
                <text x="200" y="250" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16">Property Image</text>
            </svg>
        ');
    }

    /**
     * Legacy accessor for backward compatibility
     */
    public function getCheminImageAttribute(): string
    {
        return $this->getUrlAttribute();
    }
}
