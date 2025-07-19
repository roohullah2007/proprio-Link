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
    protected $appends = ['url', 'chemin_image'];

    /**
     * Relationship with property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get full image URL accessor
     */
    public function getCheminImageAttribute(): string
    {
        if (!$this->chemin_fichier) {
            return '';
        }
        return asset('storage/' . $this->chemin_fichier);
    }

    /**
     * Get full image URL (main accessor)
     */
    public function getUrlAttribute(): string
    {
        if (!$this->chemin_fichier) {
            return '';
        }
        return asset('storage/' . $this->chemin_fichier);
    }
}
