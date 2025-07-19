<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'prenom' => fake('fr_FR')->firstName(),
            'nom' => fake('fr_FR')->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake('fr_FR')->phoneNumber(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'type_utilisateur' => fake()->randomElement(['PROPRIETAIRE', 'AGENT']),
            'numero_siret' => fake()->optional()->numerify('##############'),
            'licence_professionnelle_url' => null,
            'est_verifie' => fake()->boolean(20), // 20% chance of being verified
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
