<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Classe::create($this->validated($request));

        return back()->with('success', 'Classe créée.');
    }

    public function update(Request $request, Classe $classe): RedirectResponse
    {
        $classe->update($this->validated($request));

        return back()->with('success', 'Classe modifiée.');
    }

    public function destroy(Classe $classe): RedirectResponse
    {
        $classe->delete();

        return back()->with('success', 'Classe supprimée.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'parcours_id' => 'required|integer|exists:parcours,id',
        ]);
    }
}
