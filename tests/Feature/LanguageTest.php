<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Session;
use Tests\TestCase;

class LanguageTest extends TestCase
{
    use RefreshDatabase;

    public function test_default_language_is_french(): void
    {
        $response = $this->get('/');
        
        $response->assertOk();
        $this->assertEquals('fr', app()->getLocale());
    }

    public function test_can_change_language_to_english(): void
    {
        $response = $this->post('/language/change', [
            'language' => 'en'
        ]);

        $response->assertRedirect();
        $this->assertEquals('en', Session::get('locale'));
    }

    public function test_can_change_language_to_french(): void
    {
        $response = $this->post('/language/change', [
            'language' => 'fr'
        ]);

        $response->assertRedirect();
        $this->assertEquals('fr', Session::get('locale'));
    }

    public function test_invalid_language_code_is_rejected(): void
    {
        $response = $this->post('/language/change', [
            'language' => 'invalid'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    public function test_language_persists_across_requests(): void
    {
        // Set language to English
        $this->post('/language/change', [
            'language' => 'en'
        ]);

        // Make another request and check locale
        $response = $this->get('/');
        $response->assertOk();
        $this->assertEquals('en', app()->getLocale());
    }

    public function test_current_language_api_returns_correct_data(): void
    {
        // Set language to English
        Session::put('locale', 'en');

        $response = $this->get('/language/current');

        $response->assertOk();
        $response->assertJson([
            'current_locale' => 'en',
            'available_locales' => ['fr', 'en']
        ]);
    }
}
