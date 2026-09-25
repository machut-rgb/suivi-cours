<?php

use App\Models\Activite;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->responsable()->create());
});

test('only delegues are listed', function () {
    User::factory()->count(2)->create();

    $this->get('/delegues')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Responsable/Delegues')
        ->has('delegues', 2)
    );
});

test('responsable can approve and revoke a delegue', function () {
    $delegue = User::factory()->pending()->create();

    $this->post("/delegues/{$delegue->id}/approve")->assertSessionHas('success');
    expect($delegue->fresh()->approved_at)->not->toBeNull();

    $this->post("/delegues/{$delegue->id}/revoke");
    expect($delegue->fresh()->approved_at)->toBeNull();
});

test('rejecting a pending registration deletes it', function () {
    $delegue = User::factory()->pending()->create();

    $this->delete("/delegues/{$delegue->id}")->assertSessionHas('success');
    expect(User::find($delegue->id))->toBeNull();
});

test('a delegue with reports cannot be deleted, only suspended', function () {
    $delegue = User::factory()->pending()->create();
    Activite::factory()->for($delegue)->create();

    $this->delete("/delegues/{$delegue->id}")->assertSessionHas('error');
    expect(User::find($delegue->id))->not->toBeNull();
});

test('approved delegues cannot be rejected', function () {
    $delegue = User::factory()->create();

    $this->delete("/delegues/{$delegue->id}")->assertStatus(422);
});

test('these endpoints never touch responsable accounts', function () {
    $other = User::factory()->responsable()->create();

    $this->post("/delegues/{$other->id}/revoke")->assertNotFound();
    $this->delete("/delegues/{$other->id}")->assertNotFound();
    expect(User::find($other->id))->not->toBeNull();
});
