<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid();
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'prenom',
        'nom',
        'email',
        'telephone',
        'password',
        'type_utilisateur',
        'verification_statut',
        'numero_siret',
        'licence_professionnelle_url',
        'profile_image',
        'est_verifie',
        'is_suspended',
        'suspended_at',
        'suspension_reason',
        'language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_image_url',
        'profile_initials'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'est_verifie' => 'boolean',
            'is_suspended' => 'boolean',
            'suspended_at' => 'datetime',
        ];
    }

    /**
     * User types constants
     */
    const TYPE_PROPRIETAIRE = 'PROPRIETAIRE';
    const TYPE_AGENT = 'AGENT';
    const TYPE_ADMIN = 'ADMIN';

    /**
     * Check if user is a property owner
     */
    public function isProprietaire(): bool
    {
        return $this->type_utilisateur === self::TYPE_PROPRIETAIRE;
    }

    /**
     * Check if user is an agent
     */
    public function isAgent(): bool
    {
        return $this->type_utilisateur === self::TYPE_AGENT;
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->type_utilisateur === self::TYPE_ADMIN;
    }

    /**
     * Get full name (French format: Prénom Nom)
     */
    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }

    /**
     * Get profile image URL
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if (!$this->profile_image) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (str_starts_with($this->profile_image, 'http')) {
            return $this->profile_image;
        }
        
        // Check if it's the new uploads path format
        if (str_starts_with($this->profile_image, 'uploads/')) {
            return asset($this->profile_image);
        }
        
        // Legacy storage path format
        return asset('storage/' . $this->profile_image);
    }

    /**
     * Get profile initials for avatar fallback
     */
    public function getProfileInitialsAttribute(): string
    {
        $firstInitial = $this->prenom ? strtoupper(substr($this->prenom, 0, 1)) : '';
        $lastInitial = $this->nom ? strtoupper(substr($this->nom, 0, 1)) : '';
        return $firstInitial . $lastInitial;
    }

    /**
     * Check if user is suspended
     */
    public function isSuspended(): bool
    {
        return $this->is_suspended;
    }

    /**
     * Suspend the user
     */
    public function suspend($reason = null): void
    {
        $this->update([
            'is_suspended' => true,
            'suspended_at' => now(),
            'suspension_reason' => $reason
        ]);
    }

    /**
     * Activate the user (remove suspension)
     */
    public function activate(): void
    {
        $this->update([
            'is_suspended' => false,
            'suspended_at' => null,
            'suspension_reason' => null
        ]);
    }

    /**
     * Relationship with properties (for property owners)
     */
    public function properties()
    {
        return $this->hasMany(Property::class, 'proprietaire_id');
    }

    /**
     * Legacy alias for properties relationship
     */
    public function proprietes()
    {
        return $this->properties();
    }

    /**
     * Relationship with contact purchases (for agents)
     */
    public function contactPurchases()
    {
        return $this->hasMany(ContactPurchase::class, 'agent_id');
    }
}
