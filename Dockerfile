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

#RUN apt-get -y install systemd
RUN apt -y install apache2 && systemctl enable apache2
RUN apt-get install libapache2-mod-wsgi-py3

#RUN apt-get install nodejs -y npm

WORKDIR /app/mainapp-ui
ENV PATH /app/mainapp-ui/node_modules/.bin:$PATH
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y build-essential nodejs && node --version && npm --version
COPY --chown=2001:0 src/main/mainapp-ui/package.json /app/mainapp-ui/package.json
RUN npm install

#COPY Data React
COPY --chown=2001:0 src/main/mainapp-ui/public/ /app/mainapp-ui/public/
COPY --chown=2001:0 src/main/mainapp-ui/src/ /app/mainapp-ui/src/
COPY --chown=2001:0 src/correct/TabsTab.css /app/mainapp-ui/node_modules/@consta/uikit/__internal__/src/components/Tabs/Tab/TabsTab.css
RUN npm run build

# COPY Data Django
COPY --chown=2001:0 src/main/authentication/ /app/authentication/
COPY --chown=2001:0 src/main/core/ /app/core/
COPY --chown=2001:0 src/main/ito/ /app/ito/
COPY --chown=2001:0 src/main/mainapp/ /app/mainapp/
COPY --chown=2001:0 src/main/manage.py /app/manage.py

RUN chgrp -R 0 /app && chmod -R g=u /app
#RUN chgrp -R 0 /etc && chmod -R g=u /etc
RUN chgrp -R 0 /run && chmod -R g=u /run
RUN chgrp -R 0 /var/log && chmod -R g=u /var/log

# COPY data for Apache Server
COPY --chown=2001:0 src/config/apache/apache2.conf /etc/apache2/apache2.conf
COPY --chown=2001:0 src/config/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY --chown=2001:0 src/config/apache/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY --chown=2001:0 src/config/apache/ports.conf /etc/apache2/ports.conf

# Setting entrypoint for containers
WORKDIR /app
COPY --chown=2001:0 ./entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

# Network properties
EXPOSE 8000

# User
USER 2001
