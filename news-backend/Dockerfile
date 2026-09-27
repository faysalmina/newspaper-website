FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libpng-dev libonig-dev libxml2-dev libzip-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mbstring pdo_mysql bcmath exif zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --optimize-autoloader --no-dev --no-interaction

EXPOSE 8080

CMD ["sh", "-c", "echo '>>> Running migrate' && php artisan migrate --force && echo '>>> Migrate done, linking storage' && (php artisan storage:link || echo '>>> storage:link failed, continuing') && echo '>>> Starting server' && php artisan serve --host 0.0.0.0 --port ${PORT:-8080}"]