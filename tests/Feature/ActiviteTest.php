<?php

use App\Models\Activite;
use App\Models\Chapitre;
use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Programme;
use App\Models\User;

beforeEach(function () {
    $this->classe = Classe::factory()->create();
    $programme = Programme::factory()->for(Matiere::factory()->for($this->classe))->create();
    $this->chapitre = Chapitre::factory()->for($programme)->create();
    $this->delegue = User::factory()->create(['classe_id' => $this->classe->id]);
});

test('delegue dashboard lists own class programmes and own reports', function () {
    Activite::factory()->for($this->delegue)->for($this->chapitre)->create();
    Activite::factory()->create(); // someone else's report
    Programme::factory()->create(); // another class's programme

    $this->actingAs($this->delegue)
        ->get('/dashboard/delegue')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Delegue/Dashboard')
            ->has('programmes', 1)
            ->has('activites', 1)
        );
});

test('delegue can report on a chapter of their class and close it', function () {
    $this->actingAs($this->delegue)
        ->post('/activites', [
            'chapitre_id' => $this->chapitre->id,
            'note' => 'Cours sur les suites',
            'date' => now()->toDateString(),
            'mark_finished' => true,
        ])
        ->assertSessionHas('success');

    $activite = Activite::firstOrFail();
    expect($activite->user_id)->toBe($this->delegue->id)
        ->and($activite->note)->toBe('Cours sur les suites');

    $this->chapitre->refresh();
    expect($this->chapitre->isFinished)->toBeTrue()
        ->and($this->chapitre->finished_at)->not->toBeNull();
});

test('delegue cannot report on another class', function () {
    $foreign = Chapitre::factory()->create();

    $this->actingAs($this->delegue)
        ->post('/activites', [
            'chapitre_id' => $foreign->id,
            'note' => 'x',
            'date' => now()->toDateString(),
            'mark_finished' => true,
        ])
        ->assertForbidden();

    expect(Activite::count())->toBe(0)
        ->and($foreign->fresh()->isFinished)->toBeFalse();
});

test('report dates cannot be in the future', function () {
    $this->actingAs($this->delegue)
        ->post('/activites', [
            'chapitre_id' => $this->chapitre->id,
            'note' => 'x',
            'date' => now()->addDay()->toDateString(),
        ])
        ->assertSessionHasErrors('date');
});

test('delegue can edit and delete only their own reports', function () {
    $mine = Activite::factory()->for($this->delegue)->for($this->chapitre)->create();
    $classmate = User::factory()->create(['classe_id' => $this->classe->id]);
    $theirs = Activite::factory()->for($classmate)->for($this->chapitre)->create();

    $payload = ['chapitre_id' => $this->chapitre->id, 'note' => 'Modifié', 'date' => now()->toDateString()];

    $this->actingAs($this->delegue)->put("/activites/{$mine->id}", $payload)->assertSessionHas('success');
    expect($mine->fresh()->note)->toBe('Modifié');

    $this->actingAs($this->delegue)->put("/activites/{$theirs->id}", $payload)->assertForbidden();
    $this->actingAs($this->delegue)->delete("/activites/{$theirs->id}")->assertForbidden();
    expect(Activite::find($theirs->id))->not->toBeNull();

    $this->actingAs($this->delegue)->delete("/activites/{$mine->id}")->assertSessionHas('success');
    expect(Activite::find($mine->id))->toBeNull();
});

test('a report cannot be moved to a chapter of another class', function () {
    $mine = Activite::factory()->for($this->delegue)->for($this->chapitre)->create();
    $foreign = Chapitre::factory()->create();

    $this->actingAs($this->delegue)
        ->put("/activites/{$mine->id}", ['chapitre_id' => $foreign->id, 'note' => 'x', 'date' => now()->toDateString()])
        ->assertForbidden();

    expect($mine->fresh()->chapitre_id)->toBe($this->chapitre->id);
});
