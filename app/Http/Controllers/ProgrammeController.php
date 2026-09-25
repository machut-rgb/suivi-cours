<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProgrammeRequest;
use App\Models\Programme;
use App\Services\ProgressionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProgrammeController extends Controller
{
    /**
     * Liste des programmes, regroupés par parcours et classe côté client.
     */
    public function index(ProgressionService $progression): Response
    {
        $programmes = Programme::with([
            'matiere.classe.parcours',
            'chapitres' => fn ($q) => $q->orderBy('id'),
            'chapitres.activites' => fn ($q) => $q->with('user:id,name')->orderByDesc('date'),
        ])->get();

        $programmes->each(fn (Programme $p) => $p->setAttribute('progression', $progression->percentage($p)));

        return Inertia::render('Responsable/Programs', [
            'title' => 'Programmes',
            'programs' => $programmes,
        ]);
    }

    /**
     * Renommer le programme et synchroniser ses chapitres (création, renommage, statut, suppression).
     */
    public function update(UpdateProgrammeRequest $request, Programme $programme): RedirectResponse
    {
        $data = $request->validated();
        $ownedIds = $programme->chapitres()->pluck('id');

        // Reject chapter ids that belong to another programme instead of silently editing them.
        $foreignIds = collect($data['chapters'])
            ->pluck('id')
            ->filter()
            ->merge($data['removed_chapter_ids'] ?? [])
            ->diff($ownedIds);

        if ($foreignIds->isNotEmpty()) {
            throw ValidationException::withMessages([
                'chapters' => 'Un ou plusieurs chapitres n\'appartiennent pas à ce programme.',
            ]);
        }

        DB::transaction(function () use ($programme, $data) {
            $programme->update(['name' => $data['name']]);

            if (! empty($data['removed_chapter_ids'])) {
                $programme->chapitres()->whereIn('id', $data['removed_chapter_ids'])->delete();
            }

            foreach ($data['chapters'] as $chapter) {
                $attributes = [
                    'title' => $chapter['title'],
                    'isFinished' => (bool) $chapter['isFinished'],
                ];

                if (! empty($chapter['id'])) {
                    // Model save (not a mass update) so the finished_at hook runs.
                    $programme->chapitres()->findOrFail($chapter['id'])->fill($attributes)->save();
                } else {
                    $programme->chapitres()->create($attributes);
                }
            }
        });

        return back()->with('success', 'Programme enregistré avec succès.');
    }
}
