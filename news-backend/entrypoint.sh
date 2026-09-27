#!/bin/bash
set -x

echo "===== ENTRYPOINT STARTED ====="

php artisan migrate --force
echo "===== MIGRATE EXIT CODE: $? ====="

php artisan storage:link
echo "===== STORAGE LINK EXIT CODE: $? ====="

echo "===== STARTING SERVER ON PORT ${PORT:-8080} ====="
exec php artisan serve --host 0.0.0.0 --port ${PORT:-8080}