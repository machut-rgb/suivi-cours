<?php

use App\Http\Controllers\ActiviteController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DelegueController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\ParcoursController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\ProgrammeExportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil pour les utilisateurs non authentifiés
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// Shown to self-registered délégués until a responsable approves them.
Route::get('/approval-pending', function () {
    if (auth()->user()->isApproved()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/PendingApproval');
})->middleware('auth')->name('approval.pending');

Route::middleware(['auth', 'verified', 'approved'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Gestion du profil utilisateur
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Routes pour les responsables
    Route::middleware('can:responsable')->group(function () {
        Route::get('/dashboard/responsable', [DashboardController::class, 'responsable'])->name('dashboard.responsable');

        Route::resource('parcours', ParcoursController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['parcours' => 'parcours']);
        Route::resource('classes', ClasseController::class)
            ->only(['store', 'update', 'destroy'])
            ->parameters(['classes' => 'classe']);
        Route::resource('matieres', MatiereController::class)
            ->only(['store', 'update', 'destroy']);

        Route::resource('programmes', ProgrammeController::class)->only(['index', 'update']);
        Route::get('/programmes/{programme}/export', [ProgrammeExportController::class, 'exportPdf'])->name('programmes.export');

        Route::get('/delegues', [DelegueController::class, 'index'])->name('delegues.index');
        Route::post('/delegues/{user}/approve', [DelegueController::class, 'approve'])->name('delegues.approve');
        Route::post('/delegues/{user}/revoke', [DelegueController::class, 'revoke'])->name('delegues.revoke');
        Route::delete('/delegues/{user}', [DelegueController::class, 'reject'])->name('delegues.reject');
    });

    // Routes pour les délégués
    Route::middleware('can:delegue')->group(function () {
        Route::get('/dashboard/delegue', [ActiviteController::class, 'index'])->name('dashboard.delegue');
        Route::resource('activites', ActiviteController::class)->only(['store', 'update', 'destroy']);
    });
});

require __DIR__.'/auth.php';
