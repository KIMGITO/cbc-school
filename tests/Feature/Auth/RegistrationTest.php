<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    // TODO:  Testing if admin can store new
    /**
     * Admin can register a new user
     * @return void
     */

    // public function test_new_users_can_register()
    // {
    //     $response = $this->post(route('register.store'), [
    //         'sir_name' => 'Test',
    //         'first_name' => 'User',
    //         'other_names' => 'Super',
    //         'email' => 'test@example.com',
    //         'password' => 'password',
    //         'password_confirmation' => 'password',
    //     ]);

    //     $response->assertRedirect(route('dashboard', absolute: false));
    // }
}
