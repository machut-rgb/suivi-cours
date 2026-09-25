# Deploying SuiviApp

SuiviApp ships as a single Docker image: Apache with mod_php (PHP 8.2), the compiled front-end, and an entrypoint that prepares storage and runs migrations. It runs anywhere that runs a container: a VPS with Docker, Railway, Render, Fly.io, Coolify, and so on.

## What's in the image

| Stage | Base | Produces |
| --- | --- | --- |
| `vendor` | `composer:2` | production PHP dependencies (no dev packages) |
| `assets` | `node:20-alpine` | `public/build` (Vite) |
| `runtime` | `php:8.2-apache` | the app, with the extensions gd, pdo_sqlite, pdo_mysql, pdo_pgsql, zip and opcache |

On every start, `docker/entrypoint.sh`:
1. refuses to start without `APP_KEY`;
2. recreates the `storage/` tree, and the SQLite file when SQLite is used;
3. caches config, routes and views;
4. runs `migrate --force`, unless `RUN_MIGRATIONS=false`;
5. seeds demo data only if `SEED_DEMO_DATA=true` **and** the database has no users;
6. hands `storage/` to `www-data` and starts Apache on port 80.

`/up` is the health endpoint, and the image declares a `HEALTHCHECK` on it.

## 1. Configure

```bash
cp .env.production.example .env.production
```

Fill in at least:
- `APP_KEY`: generate it with `docker run --rm suiviapp php artisan key:generate --show`. It must stay stable: changing it logs everyone out and breaks encrypted sessions.
- `APP_URL`: the public URL. When it starts with `https://`, all generated links use https.
- `TRUSTED_PROXIES`: `*` behind a PaaS router or load balancer that terminates TLS; empty when the container is exposed directly.
- The `MAIL_*` variables. Password-reset e-mails need a real SMTP server.

`.env.production` is gitignored. Never commit it.

## 2. Run with Docker Compose (VPS)

```bash
docker compose up -d --build
docker compose exec -u www-data app php artisan app:create-responsable you@school.fr --name="Your Name"
```

- The app listens on `http://<host>:8080`. Put a TLS reverse proxy in front of it (Caddy, Traefik or Nginx), then set `APP_URL=https://…` and `TRUSTED_PROXIES=*`.
- `app:create-responsable` asks for the password interactively. Self-registration only ever creates délégués, so this command is how the first coordinator account is created.
- Always run artisan as `-u www-data`. As root it can leave files Apache cannot write.

## 3. Run on a Docker PaaS (Railway, Render, Fly.io…)

- Point the service at this repository. The platform builds the `Dockerfile`, and the app listens on port 80.
- Add the variables from `.env.production.example` in the platform's dashboard.
- **Attach a persistent volume at `/var/www/html/storage`** if you keep SQLite. Without a volume, the database is lost on every redeploy.
- Alternatively, use a managed PostgreSQL: set `DB_CONNECTION=pgsql` and the `DB_*` variables.
- Create the first account from the platform's shell: `php artisan app:create-responsable you@school.fr`.

## Database choice

- **SQLite** (the default) stores a single file in the storage volume. It fits one school with a few dozen concurrent users and needs no extra service. Back up by copying `storage/database/database.sqlite`, or with `sqlite3 … ".backup"`.
- **PostgreSQL or MySQL**: use one for several schools or several app instances. The image ships the drivers for both. The migrations run in foreign-key order, but CI only exercises them on SQLite, so run `php artisan migrate` against a staging database once before going live.

## Updating

```bash
git pull
docker compose up -d --build   # migrations run automatically on start
```

To migrate by hand, set `RUN_MIGRATIONS=false` and run `php artisan migrate --force` yourself. This is the safer choice when several replicas start at once.

## Security checklist

- `APP_DEBUG=false`. The image default is false, so don't override it.
- HTTPS in front, with `SESSION_SECURE_COOKIE=true`.
- `SEED_DEMO_DATA=false` in production, because the demo accounts use the password `password`.
- The storage volume is backed up.
- PHP version headers are off (`expose_php = Off`), and Apache shows no version (`ServerTokens Prod`).

## What was verified, and where

- **Locally:** the entrypoint's steps in production mode. That covers the config, route and view caches, migrations on an empty SQLite database, `app:create-responsable`, and a browser session that builds a parcours, a class and a subject from zero.
- **CI** (`.github/workflows/laravel.yml`, `docker` job): builds the image, starts it, then checks `/up`, the login page, the auth redirect, account creation, migrations, and that no `X-Powered-By` header is sent.
