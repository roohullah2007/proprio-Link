<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_proprietaire_can_register(): void
    {
        $response = $this->post('/register', [
            'prenom' => 'Jean',
            'nom' => 'Dupont',
            'email' => 'jean.dupont@example.com',
            'telephone' => '0123456789',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'type_utilisateur' => 'PROPRIETAIRE',
        ]);

        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseHas('users', [
            'prenom' => 'Jean',
            'nom' => 'Dupont',
            'email' => 'jean.dupont@example.com',
            'type_utilisateur' => 'PROPRIETAIRE',
            'est_verifie' => false,
        ]);
    }

    public function test_agent_can_register_with_documents(): void
    {
        Storage::fake('public');
        
        $file = UploadedFile::fake()->create('licence.pdf', 1000, 'application/pdf');

        $response = $this->post('/register', [
            'prenom' => 'Marie',
            'nom' => 'Martin',
            'email' => 'marie.martin@example.com',
            'telephone' => '0123456789',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'type_utilisateur' => 'AGENT',
            'numero_siret' => '12345678901234',
            'licence_professionnelle' => $file,
        ]);

        $response->assertRedirect('/dashboard');
        
        $this->assertDatabaseHas('users', [
            'prenom' => 'Marie',
            'nom' => 'Martin',
            'email' => 'marie.martin@example.com',
            'type_utilisateur' => 'AGENT',
            'numero_siret' => '12345678901234',
            'est_verifie' => false,
        ]);

        // Check that file was uploaded
        $user = User::where('email', 'marie.martin@example.com')->first();
        $this->assertNotNull($user->licence_professionnelle_url);
        Storage::disk('public')->assertExists($user->licence_professionnelle_url);
    }

    public function test_agent_registration_requires_siret(): void
    {
        $response = $this->post('/register', [
            'prenom' => 'Pierre',
            'nom' => 'Durand',
            'email' => 'pierre.durand@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'type_utilisateur' => 'AGENT',
            // Missing numero_siret and licence_professionnelle
        ]);

        $response->assertSessionHasErrors(['numero_siret', 'licence_professionnelle']);
    }

    public function test_user_can_login_with_french_credentials(): void
    {
        $user = User::factory()->create([
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => 'test@example.com',
            'type_utilisateur' => 'PROPRIETAIRE',
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_dashboard_shows_user_type_specific_content(): void
    {
        // Test proprietaire dashboard
        $proprietaire = User::factory()->create([
            'prenom' => 'Jean',
            'nom' => 'Propriétaire',
            'type_utilisateur' => 'PROPRIETAIRE',
        ]);

        $response = $this->actingAs($proprietaire)->get('/dashboard');
        $response->assertOk();
        $response->assertSeeText('Bienvenue, Jean Propriétaire');
        $response->assertSeeText('Biens publiés');

        // Test agent dashboard
        $agent = User::factory()->create([
            'prenom' => 'Marie',
            'nom' => 'Agent',
            'type_utilisateur' => 'AGENT',
        ]);

        $response = $this->actingAs($agent)->get('/dashboard');
        $response->assertOk();
        $response->assertSeeText('Bienvenue, Marie Agent');
        $response->assertSeeText('Contacts achetés');
    }
}
