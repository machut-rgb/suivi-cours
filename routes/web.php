<?php

use App\Http\Controllers\ClasseController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\ActiviteController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/responsable', [DashboardController::class, 'responsable'])->name('dashboard.responsable');
    Route::get('/dashboard/delegue', [DashboardController::class, 'delegue'])->name('dashboard.delegue');
});

// Page d'accueil pour les utilisateurs non authentifiés
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// Tableau de bord pour les utilisateurs authentifiés
Route::middleware(['auth', 'verified'])->group(function () {
    // Gestion du profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Routes pour les responsables
    Route::middleware('can:responsable')->group(function () {
        Route::resource('classes', ClasseController::class);
        Route::resource('matieres', MatiereController::class);
        Route::resource('programmes', ProgrammeController::class);
    });

    // Routes pour les délégués
    Route::middleware('can:delegue')->group(function () {
        Route::resource('activites', ActiviteController::class);
    });
});

require __DIR__.'/auth.php';