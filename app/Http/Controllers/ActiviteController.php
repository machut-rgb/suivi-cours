<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use App\Models\Chapitre;
use App\Models\Programme;
use App\Services\ProgressionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ActiviteController extends Controller
{
    /**
     * Tableau de bord du délégué : programmes de sa classe et ses rapports.
     */
    public function index(Request $request, ProgressionService $progression): Response
    {
        $user = $request->user()->load('classe.parcours');

        $programmes = Programme::whereHas('matiere', fn ($q) => $q->where('classe_id', $user->classe_id))
            ->with(['matiere:id,name,classe_id', 'chapitres' => fn ($q) => $q->orderBy('id')])
            ->get()
            ->sortBy('matiere.name')
            ->values();

        $programmes->each(fn (Programme $p) => $p->setAttribute('progression', $progression->percentage($p)));

        $activites = $user->activites()
            ->with('chapitre:id,title,programme_id,isFinished', 'chapitre.programme:id,matiere_id', 'chapitre.programme.matiere:id,name')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Delegue/Dashboard', [
            'title' => 'Tableau de Bord - Délégué',
            'classe' => $user->classe,
            'programmes' => $programmes,
            'activites' => $activites,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $chapitre = Chapitre::with('programme.matiere')->findOrFail($data['chapitre_id']);
        Gate::authorize('create', [Activite::class, $chapitre]);

        DB::transaction(function () use ($request, $data, $chapitre) {
            $request->user()->activites()->create([
                'chapitre_id' => $chapitre->id,
                'note' => $data['note'],
                'date' => $data['date'],
            ]);
            $this->markFinishedIfRequested($chapitre, $data);
        });

        return back()->with('success', 'Rapport enregistré.');
    }

    public function update(Request $request, Activite $activite): RedirectResponse
    {
        $data = $this->validated($request);
        $chapitre = Chapitre::with('programme.matiere')->findOrFail($data['chapitre_id']);
        Gate::authorize('update', [$activite, $chapitre]);

        DB::transaction(function () use ($activite, $data, $chapitre) {
            $activite->update([
                'chapitre_id' => $chapitre->id,
                'note' => $data['note'],
                'date' => $data['date'],
            ]);
            $this->markFinishedIfRequested($chapitre, $data);
        });

        return back()->with('success', 'Rapport modifié.');
    }

    public function destroy(Activite $activite): RedirectResponse
    {
        Gate::authorize('delete', $activite);
        $activite->delete();

        return back()->with('success', 'Rapport supprimé.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'chapitre_id' => 'required|integer|exists:chapitres,id',
            'note' => 'required|string|max:2000',
            'date' => 'required|date|before_or_equal:today',
            'mark_finished' => 'sometimes|boolean',
        ]);
    }

    /**
     * A délégué can close a chapter when reporting on it; only a responsable can reopen one.
     */
    private function markFinishedIfRequested(Chapitre $chapitre, array $data): void
    {
        if (! empty($data['mark_finished']) && ! $chapitre->isFinished) {
            $chapitre->isFinished = true;
            $chapitre->save();
        }
    }
}
