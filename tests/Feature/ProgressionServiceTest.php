<?php

use App\Models\Activite;
use App\Models\Chapitre;
use App\Models\Programme;
use App\Services\ProgressionService;
use Illuminate\Support\Carbon;

test('percentage is the share of finished chapters', function () {
    $programme = Programme::factory()->create();
    Chapitre::factory()->finished()->for($programme)->create();
    Chapitre::factory()->count(3)->for($programme)->create();

    expect(app(ProgressionService::class)->percentage($programme->load('chapitres')))->toBe(25.0);
});

test('empty programme has zero progression and no series', function () {
    $programme = Programme::factory()->create()->load('chapitres');
    $service = app(ProgressionService::class);

    expect($service->percentage($programme))->toBe(0.0)
        ->and($service->monthly($programme))->toBe([]);
});

test('monthly series is cumulative and based on finished_at', function () {
    $programme = Programme::factory()->create();

    $jan = Chapitre::factory()->for($programme)->create();
    $jan->forceFill(['isFinished' => true, 'finished_at' => Carbon::parse('2026-01-15')])->save();
    $mar = Chapitre::factory()->for($programme)->create();
    $mar->forceFill(['isFinished' => true, 'finished_at' => Carbon::parse('2026-03-10')])->save();
    Chapitre::factory()->count(2)->for($programme)->create();
    Activite::factory()->for($jan)->create(['date' => '2026-01-05']);

    $series = app(ProgressionService::class)->monthly(
        $programme->load('chapitres.activites'),
        Carbon::parse('2026-04-01'),
    );

    expect(array_column($series, 'month'))->toBe(['2026-01', '2026-02', '2026-03', '2026-04'])
        ->and(array_column($series, 'progression'))->toBe([25.0, 25.0, 50.0, 50.0])
        ->and($series[0]['activities'])->toBe(1);
});
