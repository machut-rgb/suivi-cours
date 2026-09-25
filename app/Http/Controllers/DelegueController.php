<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DelegueController extends Controller
{
    public function index(): Response
    {
        $delegues = User::where('role', 'delegue')
            ->with('classe.parcours')
            ->withCount('activites')
            ->orderByRaw('approved_at is not null')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'classe_id', 'approved_at', 'created_at']);

        return Inertia::render('Responsable/Delegues', [
            'title' => 'Délégués',
            'delegues' => $delegues,
        ]);
    }

    public function approve(User $user): RedirectResponse
    {
        $this->ensureDelegue($user);
        $user->forceFill(['approved_at' => now()])->save();

        return back()->with('success', "{$user->name} peut maintenant saisir des rapports.");
    }

    public function revoke(User $user): RedirectResponse
    {
        $this->ensureDelegue($user);
        $user->forceFill(['approved_at' => null])->save();

        return back()->with('success', "Accès de {$user->name} suspendu.");
    }

    /**
     * Rejeter une inscription en attente (supprime le compte).
     */
    public function reject(User $user): RedirectResponse
    {
        $this->ensureDelegue($user);
        abort_if($user->approved_at !== null, 422, 'Only pending registrations can be rejected.');

        // A suspended délégué has history; deleting them would cascade-delete their reports.
        if ($user->activites()->exists()) {
            return back()->with('error', "{$user->name} a déjà des rapports : suspendez le compte plutôt que de le supprimer.");
        }

        $user->delete();

        return back()->with('success', 'Inscription rejetée.');
    }

    private function ensureDelegue(User $user): void
    {
        // Never let this endpoint touch responsable accounts.
        abort_unless($user->isDelegue(), 404);
    }
}
