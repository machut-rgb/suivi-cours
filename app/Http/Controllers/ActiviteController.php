<?php
namespace App\Http\Controllers;

use App\Models\Activite;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActiviteController extends Controller
{
    use AuthorizesRequests;
    public function __construct()
    {
        $this->authorizeResource(Activite::class, 'activite');
    }

    /**
     * Afficher la liste des activités.
     */
    public function index()
    {
        $activites = Activite::with('programme.matiere.classe', 'user')->get();
        return response()->json($activites);
    }

    /**
     * Afficher une activité spécifique.
     */
    public function show(Activite $activite)
    {
        $activite->load('programme.matiere.classe', 'user');
        return response()->json($activite);
    }

    /**
     * Créer une nouvelle activité.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'programme_id' => 'required|exists:programmes,id',
            'chapitre_aborde' => 'required|string',
            'details' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $activite = Activite::create([
            'programme_id' => $validated['programme_id'],
            'user_id' => Auth::id(),
            'chapitre_aborde' => $validated['chapitre_aborde'],
            'details' => $validated['details'],
            'date' => $validated['date'],
        ]);

        return response()->json($activite, 201);
    }

    /**
     * Mettre à jour une activité existante.
     */
    public function update(Request $request, Activite $activite)
    {
        $validated = $request->validate([
            'programme_id' => 'required|exists:programmes,id',
            'chapitre_aborde' => 'required|string',
            'details' => 'nullable|string',
            'date' => 'required|date',
        ]);

        $activite->update($validated);
        return response()->json($activite);
    }

    /**
     * Supprimer une activité.
     */
    public function destroy(Activite $activite)
    {
        $activite->delete();
        return response()->json(null, 204);
    }
}
