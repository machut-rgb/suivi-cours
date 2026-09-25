#!/bin/sh
# SuiviApp container entrypoint: prepare storage, cache config, optionally migrate, then start Apache.
set -e
cd /var/www/html

# One-off commands (e.g. `docker run --rm suiviapp php artisan key:generate --show`) skip the boot sequence.
if [ "$1" != "apache2-foreground" ]; then
    exec "$@"
fi

if [ -z "$APP_KEY" ]; then
    echo "ERROR: APP_KEY is not set. Generate one with: docker run --rm <image> php artisan key:generate --show" >&2
    exit 1
fi

# storage/ is a volume: recreate the directory tree on first start.
mkdir -p storage/database storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs storage/app/public
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    DB_FILE="${DB_DATABASE:-/var/www/html/storage/database/database.sqlite}"
    [ -f "$DB_FILE" ] || touch "$DB_FILE"
fi
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force --no-interaction
fi

# Demo data only when explicitly requested, and only on an empty database.
if [ "${SEED_DEMO_DATA:-false}" = "true" ] && [ "$(php artisan tinker --execute='echo \App\Models\User::count();' 2>/dev/null | tail -n1)" = "0" ]; then
    php artisan db:seed --force --no-interaction
fi

# Everything above ran as root: hand storage and caches to Apache's user.
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
