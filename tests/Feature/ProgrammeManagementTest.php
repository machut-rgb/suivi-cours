<?php

use App\Models\Chapitre;
use App\Models\Programme;
use App\Models\User;

beforeEach(function () {
    $this->responsable = User::factory()->responsable()->create();
});

test('programmes page renders with progression', function () {
    $programme = Programme::factory()->create();
    Chapitre::factory()->finished()->for($programme)->create();
    Chapitre::factory()->for($programme)->create();

    $this->actingAs($this->responsable)
        ->get('/programmes')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Responsable/Programs')
            ->where('programs.0.progression', 50)
        );
});

test('responsable can rename, add, finish and remove chapters in one update', function () {
    $programme = Programme::factory()->create(['name' => 'Ancien nom']);
    $keep = Chapitre::factory()->for($programme)->create(['title' => 'Chap A']);
    $remove = Chapitre::factory()->for($programme)->create();

    $this->actingAs($this->responsable)
        ->put("/programmes/{$programme->id}", [
            'name' => 'Nouveau nom',
            'chapters' => [
                ['id' => $keep->id, 'title' => 'Chap A renommé', 'isFinished' => true],
                ['title' => 'Chap nouveau', 'isFinished' => false],
            ],
            'removed_chapter_ids' => [$remove->id],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($programme->fresh()->name)->toBe('Nouveau nom');

    $keep->refresh();
    expect($keep->title)->toBe('Chap A renommé')
        ->and($keep->isFinished)->toBeTrue()
        ->and($keep->finished_at)->not->toBeNull();

    expect(Chapitre::find($remove->id))->toBeNull()
        ->and($programme->chapitres()->where('title', 'Chap nouveau')->exists())->toBeTrue();
});

test('reopening a chapter clears finished_at', function () {
    $programme = Programme::factory()->create();
    $chapitre = Chapitre::factory()->finished()->for($programme)->create();
    expect($chapitre->finished_at)->not->toBeNull();

    $this->actingAs($this->responsable)->put("/programmes/{$programme->id}", [
        'name' => $programme->name,
        'chapters' => [['id' => $chapitre->id, 'title' => $chapitre->title, 'isFinished' => false]],
    ]);

    expect($chapitre->fresh()->finished_at)->toBeNull();
});

test('chapters of another programme cannot be edited or deleted through this programme', function () {
    $programme = Programme::factory()->create();
    $other = Chapitre::factory()->create(['title' => 'Intouchable']);

    $this->actingAs($this->responsable)
        ->put("/programmes/{$programme->id}", [
            'name' => 'X',
            'chapters' => [['id' => $other->id, 'title' => 'Piraté', 'isFinished' => true]],
        ])
        ->assertSessionHasErrors('chapters');

    $this->actingAs($this->responsable)
        ->put("/programmes/{$programme->id}", [
            'name' => 'X',
            'chapters' => [],
            'removed_chapter_ids' => [$other->id],
        ])
        ->assertSessionHasErrors('chapters');

    $other->refresh();
    expect($other->title)->toBe('Intouchable')
        ->and($other->isFinished)->toBeFalse();
});

test('programme update validates chapter titles', function () {
    $programme = Programme::factory()->create();

    $this->actingAs($this->responsable)
        ->put("/programmes/{$programme->id}", [
            'name' => 'X',
            'chapters' => [['title' => '', 'isFinished' => false]],
        ])
        ->assertSessionHasErrors('chapters.0.title');
});

test('pdf export downloads a pdf', function () {
    $programme = Programme::factory()->create();
    Chapitre::factory()->finished()->for($programme)->create();

    $response = $this->actingAs($this->responsable)->get("/programmes/{$programme->id}/export");

    $response->assertOk();
    expect($response->headers->get('content-type'))->toBe('application/pdf')
        ->and($response->headers->get('content-disposition'))->toContain('.pdf');
});

test('responsable dashboard exposes progression and monthly series', function () {
    $programme = Programme::factory()->create();
    Chapitre::factory()->finished()->for($programme)->create();

    $this->actingAs($this->responsable)
        ->get('/dashboard/responsable')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Responsable/Dashboard')
            ->where('programs.0.progression', 100)
            ->has('programs.0.monthly', 1)
        );
});
