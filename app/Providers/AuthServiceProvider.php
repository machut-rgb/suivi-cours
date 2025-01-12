<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Classe;
use App\Policies\ClassePolicy;
use App\Models\Matiere;
use App\Policies\MatierePolicy;
use App\Models\Programme;
use App\Policies\ProgrammePolicy;
use App\Models\Activite;
use App\Policies\ActivitePolicy;
use App\Policies\UserPolicy;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Classe::class => ClassePolicy::class,
        Matiere::class => MatierePolicy::class,
        Programme::class => ProgrammePolicy::class,
        Activite::class => ActivitePolicy::class,
        User::class => UserPolicy::class,
    ];
    

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Define the 'responsable' gate
        Gate::define('responsable', function ($user) {
            Log::info('Gate check for responsable', ['user' => $user->id, 'role' => $user->role]);
            return $user->role === 'responsable';
        });
    }
}
