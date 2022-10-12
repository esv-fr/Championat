#!/bin/bash
echo "Waiting for postgres..."
echo " DJANGO_HOST: " $DJANGO_HOST "DJANGO_PORT: " $DJANGO_PORT

while ! nc -z $DJANGO_HOST $DJANGO_PORT; do
  sleep 10

done

echo "Django started"

cd /app

source env/bin/activate

if [[ $COMMAND = "celery" ]]; then
    celery -A ito worker -l info
else
    python manage.py start_task_smtp_server
    celery -A ito beat -l info
fi

exec "$@"
