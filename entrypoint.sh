#!/bin/bash
echo "Waiting for postgres..."
echo "Database: " $DB_DATABASE "HOST: " $DB_HOST "PORT: " $DB_PORT

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
  echo "waiting ready database...  "
done

echo "PostgreSQL started"

cd /app
#ls -la /etc/apache2
#ls env/bin -l
source env/bin/activate
python manage.py collectstatic --no-input
#python3 manage.py flush --no-input

python manage.py makemigrations authentication
python manage.py makemigrations core
python manage.py makemigrations mainapp
python manage.py migrate
python manage.py createsuperuser --noinput
python manage.py dbfill

source /etc/apache2/envvars
/usr/sbin/apache2 -D FOREGROUND

exec "$@"
