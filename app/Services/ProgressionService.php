<?php

namespace App\Services;

use App\Models\Programme;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Single source of truth for syllabus progression, shared by the dashboards and the PDF export.
 *
 * Progression = finished chapters / total chapters. The monthly series is cumulative and
 * based on chapitres.finished_at, so it reflects when chapters were actually completed.
 */
class ProgressionService
{
    /**
     * Expects chapitres (and chapitres.activites for the monthly series) to be loaded.
     */
    public function percentage(Programme $programme): float
    {
        $total = $programme->chapitres->count();
        if ($total === 0) {
            return 0.0;
        }

        return round($programme->chapitres->where('isFinished', true)->count() / $total * 100, 1);
    }

    /**
     * Cumulative progression per month, from the first recorded event to the current month.
     *
     * @return list<array{month: string, progression: float, finished: int, total: int, activities: int}>
     */
    public function monthly(Programme $programme, ?Carbon $until = null): array
    {
        $chapitres = $programme->chapitres;
        $total = $chapitres->count();
        if ($total === 0) {
            return [];
        }

        $finishedDates = $chapitres->pluck('finished_at')->filter();
        $activityDates = $chapitres
            ->flatMap(fn ($chapitre) => $chapitre->relationLoaded('activites') ? $chapitre->activites : [])
            ->pluck('date')
            ->filter();

        /** @var Collection<int, Carbon> $events */
        $events = $finishedDates->merge($activityDates)->map(fn ($date) => Carbon::parse($date));
        if ($events->isEmpty()) {
            return [];
        }

        $cursor = $events->min()->copy()->startOfMonth();
        $end = ($until ?? Carbon::now())->copy()->startOfMonth();
        $series = [];

        while ($cursor <= $end) {
            $monthEnd = $cursor->copy()->endOfMonth();
            $finished = $finishedDates->filter(fn ($d) => Carbon::parse($d) <= $monthEnd)->count();
            $activities = $activityDates->filter(
                fn ($d) => Carbon::parse($d)->isSameMonth($cursor)
            )->count();

            $series[] = [
                'month' => $cursor->format('Y-m'),
                'progression' => round($finished / $total * 100, 1),
                'finished' => $finished,
                'total' => $total,
                'activities' => $activities,
            ];
            $cursor->addMonth();
        }

        return $series;
    }
}
