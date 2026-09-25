<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if ($proxies = config('app.trusted_proxies')) {
            TrustProxies::at($proxies === '*' ? '*' : array_map('trim', explode(',', $proxies)));
        }

        // TLS usually terminates at the proxy: generate https URLs when the app is served over https.
        if (str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        // Role gates used by the `can:` route middleware. Model policies are auto-discovered.
        Gate::define('responsable', fn (User $user) => $user->isResponsable());
        Gate::define('delegue', fn (User $user) => $user->isDelegue());
    }
}
