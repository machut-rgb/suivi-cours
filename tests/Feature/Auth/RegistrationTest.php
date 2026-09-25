<?php

use App\Models\Classe;
use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register as a pending delegue of a classe', function () {
    $classe = Classe::factory()->create();

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'classe_id' => $classe->id,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->first();
    expect($user->role)->toBe('delegue')
        ->and($user->classe_id)->toBe($classe->id)
        ->and($user->approved_at)->toBeNull();

    $this->get('/dashboard')->assertRedirect(route('approval.pending'));
});

test('registration requires an existing classe', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'classe_id' => 999,
    ])->assertSessionHasErrors('classe_id');

    $this->assertGuest();
});

test('registration cannot escalate to the responsable role', function () {
    $classe = Classe::factory()->create();

    $this->post('/register', [
        'name' => 'Sneaky',
        'email' => 'sneaky@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'classe_id' => $classe->id,
        'role' => 'responsable',
        'approved_at' => now()->toDateTimeString(),
    ]);

    $user = User::where('email', 'sneaky@example.com')->first();
    expect($user->role)->toBe('delegue')
        ->and($user->approved_at)->toBeNull();
});

test('approved users are sent away from the pending page', function () {
    $this->actingAs(User::factory()->create())
        ->get('/approval-pending')
        ->assertRedirect(route('dashboard'));
});
