CREATE USER django_user;
ALTER ROLE django_user WITH ENCRYPTED PASSWORD 'Jx715$31';
ALTER ROLE django_user SET client_encoding TO 'utf8';
ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_user SET timezone TO 'UTC';
\q
