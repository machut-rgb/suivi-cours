<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DelegueController extends Controller
{
    public function index()
    {
        $data = User::with('classe.parcours')->get();
        return Inertia::render('Responsable/Delegues', ['data'=> $data]);
    }
}
