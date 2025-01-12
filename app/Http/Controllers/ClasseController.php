<?php
namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class ClasseController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Classe::class, 'classe');
    }

    /**
     * Afficher la liste des classes.
     */
    public function index()
    {
        $classes = Classe::with('matieres.programmes')->get();
        return response()->json($classes);
    }

    /**
     * Afficher une classe spécifique.
     */
    public function show(Classe $classe)
    {
        $classe->load('matieres.programmes');
        return response()->json($classe);
    }

    /**
     * Créer une nouvelle classe.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $classe = Classe::create($validated);
        return response()->json($classe, 201);
    }

    /**
     * Mettre à jour une classe existante.
     */
    public function update(Request $request, Classe $classe)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $classe->update($validated);
        return response()->json($classe);
    }

    /**
     * Supprimer une classe.
     */
    public function destroy(Classe $classe)
    {
        $classe->delete();
        return response()->json(null, 204);
    }
}
