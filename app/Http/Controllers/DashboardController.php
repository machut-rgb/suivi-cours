<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use App\Services\ProgressionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Point d'entrée unique : redirige vers le tableau de bord du rôle.
     */
    public function index(): RedirectResponse
    {
        return match (Auth::user()->role) {
            'responsable' => redirect()->route('dashboard.responsable'),
            'delegue' => redirect()->route('dashboard.delegue'),
            default => abort(403, 'Unauthorized, not a responsable or delegue'),
        };
    }

    public function responsable(ProgressionService $progression): Response
    {
        $programs = Programme::with([
            'matiere.classe.parcours',
            'chapitres' => fn ($q) => $q->orderBy('id'),
            'chapitres.activites:id,chapitre_id,date',
        ])->get();

        $programs->each(function (Programme $programme) use ($progression) {
            $programme->setAttribute('progression', $progression->percentage($programme));
            $programme->setAttribute('monthly', $progression->monthly($programme));
        });

        return Inertia::render('Responsable/Dashboard', [
            'title' => 'Tableau de Bord - Responsable',
            'programs' => $programs,
        ]);
    }
}
