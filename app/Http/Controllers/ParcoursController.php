<?php

namespace App\Http\Controllers;

use App\Models\Parcours;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParcoursController extends Controller
{
    /**
     * Arborescence parcours > classes > matières, gérée depuis une seule page.
     */
    public function index(): Response
    {
        return Inertia::render('Responsable/Parcours', [
            'title' => 'Parcours, classes et matières',
            'parcours' => Parcours::with([
                'classes' => fn ($q) => $q->orderBy('name')->withCount('users'),
                'classes.matieres' => fn ($q) => $q->orderBy('name'),
            ])->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Parcours::create($request->validate([
            'name' => 'required|string|max:255|unique:parcours,name',
        ]));

        return back()->with('success', 'Parcours créé.');
    }

    public function update(Request $request, Parcours $parcours): RedirectResponse
    {
        $parcours->update($request->validate([
            'name' => 'required|string|max:255|unique:parcours,name,'.$parcours->id,
        ]));

        return back()->with('success', 'Parcours modifié.');
    }

    public function destroy(Parcours $parcours): RedirectResponse
    {
        // Cascades to classes, matières, programmes, chapitres and activités.
        $parcours->delete();

        return back()->with('success', 'Parcours supprimé.');
    }
}
