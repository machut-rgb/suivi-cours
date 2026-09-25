<?php

use App\Models\Activite;
use App\Models\User;

test('dashboard redirects each role to its own dashboard', function () {
    $this->actingAs(User::factory()->responsable()->create())
        ->get('/dashboard')->assertRedirect(route('dashboard.responsable'));

    $this->actingAs(User::factory()->create())
        ->get('/dashboard')->assertRedirect(route('dashboard.delegue'));
});

test('delegues cannot reach responsable pages', function (string $uri) {
    $this->actingAs(User::factory()->create())->get($uri)->assertForbidden();
})->with([
    '/dashboard/responsable',
    '/programmes',
    '/parcours',
    '/delegues',
]);

test('responsables cannot reach the delegue dashboard', function () {
    $this->actingAs(User::factory()->responsable()->create())
        ->get('/dashboard/delegue')->assertForbidden();
});

test('pending delegues are held at the approval page', function () {
    $this->actingAs(User::factory()->pending()->create())
        ->get('/dashboard/delegue')->assertRedirect(route('approval.pending'));
});

test('pending delegues cannot post activities', function () {
    $user = User::factory()->pending()->create();

    $this->actingAs($user)
        ->post('/activites', ['chapitre_id' => 1, 'note' => 'x', 'date' => now()->toDateString()])
        ->assertRedirect(route('approval.pending'));

    expect(Activite::count())->toBe(0);
});

test('guests are redirected to login', function () {
    $this->get('/programmes')->assertRedirect(route('login'));
});
