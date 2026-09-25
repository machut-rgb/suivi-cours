<?php

use App\Models\Classe;
use App\Models\Matiere;
use App\Models\Parcours;
use App\Models\User;

beforeEach(function () {
    $this->actingAs(User::factory()->responsable()->create());
});

test('parcours page renders the tree', function () {
    Classe::factory()->create();

    $this->get('/parcours')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Responsable/Parcours')
        ->has('parcours.0.classes.0')
    );
});

test('parcours crud', function () {
    $this->post('/parcours', ['name' => 'Parcours Tech'])->assertSessionHas('success');
    $parcours = Parcours::where('name', 'Parcours Tech')->firstOrFail();

    $this->put("/parcours/{$parcours->id}", ['name' => 'Parcours Techno'])->assertSessionHas('success');
    expect($parcours->fresh()->name)->toBe('Parcours Techno');

    $this->post('/parcours', ['name' => 'Parcours Techno'])->assertSessionHasErrors('name');

    $this->delete("/parcours/{$parcours->id}")->assertSessionHas('success');
    expect(Parcours::find($parcours->id))->toBeNull();
});

test('classe crud persists parcours_id', function () {
    $parcours = Parcours::factory()->create();
    $other = Parcours::factory()->create();

    $this->post('/classes', ['name' => 'Seconde A', 'parcours_id' => $parcours->id])->assertSessionHas('success');
    $classe = Classe::where('name', 'Seconde A')->firstOrFail();
    expect($classe->parcours_id)->toBe($parcours->id);

    $this->put("/classes/{$classe->id}", ['name' => 'Seconde B', 'parcours_id' => $other->id]);
    $classe->refresh();
    expect($classe->name)->toBe('Seconde B')->and($classe->parcours_id)->toBe($other->id);

    $this->post('/classes', ['name' => 'Orpheline'])->assertSessionHasErrors('parcours_id');

    $this->delete("/classes/{$classe->id}");
    expect(Classe::find($classe->id))->toBeNull();
});

test('creating a matiere also creates its programme', function () {
    $classe = Classe::factory()->create();

    $this->post('/matieres', ['name' => 'Informatique', 'classe_id' => $classe->id])->assertSessionHas('success');

    $matiere = Matiere::where('name', 'Informatique')->firstOrFail();
    expect($matiere->programme)->not->toBeNull()
        ->and($matiere->programme->name)->toBe('Programme de Informatique');

    $this->put("/matieres/{$matiere->id}", ['name' => 'NSI', 'classe_id' => $classe->id]);
    expect($matiere->fresh()->name)->toBe('NSI');

    $this->delete("/matieres/{$matiere->id}");
    expect(Matiere::find($matiere->id))->toBeNull();
});
