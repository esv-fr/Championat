FROM debian

ENV PYTHON_VERSION=3.9 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

USER 0

WORKDIR /app

## Install Python requirements
RUN apt-get update && apt-get -y install python3 python3-pip python3-venv python3-dev libpq-dev postgresql postgresql-contrib netcat curl systemd
RUN python3 -m venv env

COPY --chown=2001:0 src/main/requirements.txt /app/requirements.txt
SHELL ["/bin/bash", "-c"]
RUN source /app/env/bin/activate && python3 -m pip install -r requirements.txt

# COPY Data Django
COPY --chown=2001:0 src/main/authentication/ /app/authentication/
COPY --chown=2001:0 src/main/core/ /app/core/
COPY --chown=2001:0 src/main/ito/ /app/ito/
COPY --chown=2001:0 src/main/mainapp/ /app/mainapp/
COPY --chown=2001:0 src/main/manage.py /app/manage.py

RUN chgrp -R 0 /app && chmod -R g=u /app
RUN chgrp -R 0 /run && chmod -R g=u /run
RUN chgrp -R 0 /var/log && chmod -R g=u /var/log

# Setting entrypoint for containers
COPY --chown=2001:0 ./celery.entrypoint.sh .
RUN chmod +x celery.entrypoint.sh

ENTRYPOINT ["/app/celery.entrypoint.sh"]

# User
USER 2001