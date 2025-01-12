<?php
namespace App\Http\Controllers;

use App\Models\Parcours;
use App\Models\Programme;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class ProgrammeController extends Controller
{
    use AuthorizesRequests;
    public function __construct()
    {
        // Authorize resource actions for the Programme model
        // $this->authorizeResource(Programme::class, 'programme');
    }

    /**
     * Afficher la liste des programmes.
     */
    public function index()
    {
        if (!Gate::allows('responsable')) {
            abort(403, 'You are not a responsable.');
        }
        // $this->authorize('viewAny', Programme::class);
        $programmes = Programme::with('matiere.classe.parcours', 'chapitres.activites')->get();

        return Inertia::render('Responsable/Programs', [
            'title' => "Programmes",
            'programs' => $programmes,
        ]);
    }

    /**
     * Afficher un programme spécifique.
     */
    public function show(Programme $programme)
    {
        $programme->load('matiere.classe', 'activites');
        return response()->json($programme);
    }

    /**
     * Créer un nouveau programme.
     */
    public function store(Request $request)
    {
        // Journaux pour debug
        Log::info('Request data: ', $request->all());
    
        // Désérialisation des champs JSON
        $classe = json_decode($request->input('classe'), true);
        $matiere = json_decode($request->input('matiere'), true);
        $chapters = json_decode($request->input('chapters'), true);
    
        // Validation
        $validatedData = $request->validate([
            'parcours' => 'required|string',
            'name' => 'required|string',
            'chapters' => 'required|array',
            'chapters.*.title' => 'required|string',
        ]);
    
        // Exemple d'enregistrement en base
        $programme = Programme::create([
            'parcours' => $validatedData['parcours'],
            'name' => $validatedData['name'],
            'classe_id' => $classe['id'], // Utiliser l'ID désérialisé
            'matiere_id' => $matiere['id'], // Utiliser l'ID désérialisé
        ]);
    
        // Enregistrer les chapitres associés
        foreach ($chapters as $chapter) {
            $programme->chapters()->create([
                'title' => $chapter['title'],
            ]);
        }
    
        return response()->json([
            'success' => true,
            'message' => 'Programme enregistré avec succès',
            'programme' => $programme,
        ]);
    }
    

    /**
     * Mettre à jour un programme existant.
     */
    public function update(Request $request, Programme $programme)
    {
        $validated = $request->validate([
            'matiere_id' => 'required|exists:matieres,id',
            'objectif' => 'required|string',
            'chapitres' => 'required|array',
            'statut' => 'required|in:en cours,termine',
        ]);

        $programme->update([
            'matiere_id' => $validated['matiere_id'],
            'objectif' => $validated['objectif'],
            'chapitres' => $validated['chapitres'],
            'statut' => $validated['statut'],
        ]);

        return response()->json($programme);
    }

    /**
     * Supprimer un programme.
     */
    public function destroy(Programme $programme)
    {
        $programme->delete();
        return response()->json(null, 204);
    }
}
