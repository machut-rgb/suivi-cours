<?php

namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatiereController extends Controller
{
    /**
     * Chaque matière a exactement un programme : il est créé en même temps qu'elle.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($data) {
            $matiere = Matiere::create($data);
            $matiere->programme()->create(['name' => 'Programme de '.$matiere->name]);
        });

        return back()->with('success', 'Matière et programme créés.');
    }

    public function update(Request $request, Matiere $matiere): RedirectResponse
    {
        $matiere->update($this->validated($request));

        return back()->with('success', 'Matière modifiée.');
    }

    public function destroy(Matiere $matiere): RedirectResponse
    {
        $matiere->delete();

        return back()->with('success', 'Matière supprimée.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'classe_id' => 'required|integer|exists:classes,id',
        ]);
    }
}
