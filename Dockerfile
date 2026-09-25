# syntax=docker/dockerfile:1

# ---- 1. PHP dependencies (production only) ----------------------------------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Extensions (gd, pdo_pgsql…) live in the runtime stage, not in the composer image.
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --no-progress --prefer-dist --ignore-platform-req='ext-*'
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

# ---- 2. Front-end assets ------------------------------------------------------
FROM node:20-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# ziggy-js is resolved from vendor/ (see tsconfig.json / vite config)
COPY --from=vendor /app/vendor ./vendor
RUN npx vite build

# ---- 3. Runtime: Apache + mod_php -------------------------------------------
FROM php:8.2-apache AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev libpq-dev libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd pdo_mysql pdo_pgsql pdo_sqlite zip opcache \
    && apt-get purge -y --auto-remove \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite headers \
    && sed -ri 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\nServerTokens Prod\nServerSignature Off\n' > /etc/apache2/conf-enabled/app.conf

COPY docker/php.ini /usr/local/etc/php/conf.d/zz-app.ini

WORKDIR /var/www/html
COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=assets --chown=www-data:www-data /app/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/app-entrypoint
RUN chmod +x /usr/local/bin/app-entrypoint \
    && rm -f public/hot \
    && mkdir -p storage/database storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/var/www/html/storage/database/database.sqlite

EXPOSE 80
VOLUME ["/var/www/html/storage"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD php -r 'exit(@file_get_contents("http://127.0.0.1/up") === false ? 1 : 0);'

ENTRYPOINT ["app-entrypoint"]
CMD ["apache2-foreground"]
