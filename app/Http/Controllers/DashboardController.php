<?php

namespace App\Http\Controllers;

use App\Models\Activite;
use App\Models\Programme;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Redirection selon le rôle de l'utilisateur
        if (Auth::user()->role === 'responsable') {
            return redirect()->route('dashboard.responsable');
        } elseif (Auth::user()->role === 'delegue') {
            return redirect()->route('dashboard.delegue');
        }

        return abort(403, 'Unauthorized, not a responsable or delegue');
    }

    public function responsable()
    {
        // Redirection selon le rôle de l'utilisateur
        if (Auth::user()->role === 'responsable') {
            // dd(Programme::with('matiere.classe')->get()->toArray());
            return Inertia::render('Responsable/Dashboard', [
                'title' => 'Tableau de Bord - Responsable',
                'programs' => Programme::with('matiere.classe')->get(), // Exemple de données
            ]);
        } elseif (Auth::user()->role === 'delegue') {
            return redirect()->route('dashboard.delegue');
        }

        return abort(403, 'Unauthorized, not a responsable or delegue');
    }

    public function delegue()
    {
        // Redirection selon le rôle de l'utilisateur
        if (Auth::user()->role === 'responsable') {
            return redirect()->route('dashboard.responsable');
        } elseif (Auth::user()->role === 'delegue') {
            return Inertia::render('Delegue/Dashboard', [
                'title' => 'Tableau de Bord - Délégué',
                'activities' => Activite::where('user_id', Auth::id())->get(), // Exemple de données
            ]);
        }

        return abort(403, 'Unauthorized, not a responsable or delegue');
    }
}
