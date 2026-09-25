<?php

use App\Models\User;

test('create-responsable creates a verified responsable', function () {
    $this->artisan('app:create-responsable', ['email' => 'Chef@Lycee.fr', '--name' => 'Mme Chef', '--password' => 'motdepasse123'])
        ->assertSuccessful();

    $user = User::where('email', 'chef@lycee.fr')->firstOrFail();
    expect($user->role)->toBe('responsable')
        ->and($user->isApproved())->toBeTrue()
        ->and($user->email_verified_at)->not->toBeNull();

    $this->post('/login', ['email' => 'chef@lycee.fr', 'password' => 'motdepasse123']);
    $this->assertAuthenticatedAs($user);
});

test('create-responsable rejects duplicates and weak passwords', function () {
    User::factory()->create(['email' => 'taken@lycee.fr']);

    $this->artisan('app:create-responsable', ['email' => 'taken@lycee.fr', '--password' => 'motdepasse123'])
        ->assertFailed();
    $this->artisan('app:create-responsable', ['email' => 'new@lycee.fr', '--password' => 'short'])
        ->assertFailed();

    expect(User::where('email', 'new@lycee.fr')->exists())->toBeFalse();
});
