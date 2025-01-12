<?php
namespace App\Http\Controllers;

use App\Models\Matiere;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
class MatiereController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Matiere::class, 'matiere');
    }

    /**
     * Afficher la liste des matières.
     */
    public function index()
    {
        $matieres = Matiere::with('classe', 'programmes')->get();
        return response()->json($matieres);
    }

    /**
     * Afficher une matière spécifique.
     */
    public function show(Matiere $matiere)
    {
        $matiere->load('classe', 'programmes');
        return response()->json($matiere);
    }

    /**
     * Créer une nouvelle matière.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
        ]);

        $matiere = Matiere::create($validated);
        return response()->json($matiere, 201);
    }

    /**
     * Mettre à jour une matière existante.
     */
    public function update(Request $request, Matiere $matiere)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
        ]);

        $matiere->update($validated);
        return response()->json($matiere);
    }

    /**
     * Supprimer une matière.
     */
    public function destroy(Matiere $matiere)
    {
        $matiere->delete();
        return response()->json(null, 204);
    }
}
