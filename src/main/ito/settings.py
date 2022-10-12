from pathlib import Path
import environ
import imaplib

env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
#BASE_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = Path(__file__).resolve().parent.parent
DATE_INPUT_FORMATS = ['%d.%m.%Y']

#Needed for JWT
from datetime import timedelta

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str('DJANGO_SECRET_KEY', default='django-insecure-r3abx^y+!cnw8licd8f6*#xb@=&u(wtk1!21k55xub)b*c4qn&')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=True)

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'import_export',
    'mainapp',
    'core',
    'authentication',
    'django_celery_beat',
]

CELERY_BROKER_URL = env.str('CELERY_BROKER', default='celery_broker')
CELERY_RESULT_BACKEND = env.str('CELERY_BROKER', default='celery_broker')
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
EMAIL_SERVER = env.str('EMAIL_SERVER', default='imap.mail.ru')
SESSION_MAIL = {'SESSION_MAIL': imaplib.IMAP4_SSL(EMAIL_SERVER)}

EMAIL_HOST_USER = env.str('EMAIL_LOGIN', default='email_login')
EMAIL_HOST_PASSWORD = env.str('EMAIL_PASSWORD', default='email_password')
EMAIL_HOST = env.str('EMAIL_HOST', default='smtp.mail.ru')
EMAIL_PORT = env.str('SMTP_PORT', default=2525)
EMAIL_USE_TLS = env.str('SMTP_TLS', default=True)
EMAIL_USE_SSL = env.str('SMTP_SSL', default=False)
EMAIL_BACKEND = env.str('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ito.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates', 
	'DIRS': [BASE_DIR / 'mainapp-ui/build'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ito.wsgi.application'

CORS_ORIGIN_ALLOW_ALL=True

DATABASES = {
    'default': {
        'ENGINE': env.str('DB_ENGINE', default='django.db.backends.postgresql_psycopg2'),
        'NAME': env.str('DB_DATABASE', default='myproject'),
        'USER': env.str('DB_USER', default='myprojectuser'),
        'PASSWORD': env.str('DB_PASSWORD', default='password'),
        'HOST': env.str('DB_HOST', default='127.0.0.1'),
        'PORT': env.str('DB_PORT', default='5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_L10N = True
USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

STATICFILES_DIRS = (
    (BASE_DIR / 'mainapp-ui/build/static'),
)

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
	'rest_framework.permissions.IsAuthenticated'
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
	'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
}

JWT_AUTH = { 
    'JWT_ENCODE_HANDLER': 'rest_framework_jwt.utils.jwt_encode_handler', 
    'JWT_DECODE_HANDLER': 'rest_framework_jwt.utils.jwt_decode_handler', 
    'JWT_PAYLOAD_HANDLER': 'rest_framework_jwt.utils.jwt_payload_handler',
    'JWT_PAYLOAD_GET_USER_ID_HANDLER': 'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler', 
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'rest_framework_jwt.utils.jwt_response_payload_handler',
    'JWT_SECRET_KEY': 'SECRET_KEY', 
    'JWT_GET_USER_SECRET_KEY': None, 
    'JWT_PUBLIC_KEY': None, 
    'JWT_PRIVATE_KEY': None, 
    'JWT_ALGORITHM': 'HS256', 
    'JWT_VERIFY': True, 
    'JWT_VERIFY_EXPIRATION': True, 
    'JWT_LEEWAY': 0, 
    'JWT_EXPIRATION_DELTA': timedelta(days=30), 
    'JWT_AUDIENCE': None, 
    'JWT_ISSUER': None, 
    'JWT_ALLOW_REFRESH': False, 
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=30),
    'JWT_AUTH_HEADER_PREFIX': 'JWT',
    'JWT_AUTH_COOKIE': None,
}

# Custom user model
AUTH_USER_MODEL = "authentication.CustomUser"

# Logger
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'file': {
            'format': '%(asctime)s %(name)-12s %(levelname)-8s %(message)s',
        },
        'simplefile':{
            'format': '%(levelname)-8s %(message)s',
        },
        'console': {
            'format': '%(asctime)s %(levelname)-8s %(message)s',
        },
     },
    'handlers': {
        'auth_file':{
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'formatter': 'file',
            'filename': BASE_DIR / 'auth_info.log',
        },
        'smtp_server_file':{
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'formatter': 'file',
            'filename': BASE_DIR / 'smtp_server_file.log',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'formatter': 'file',
            'filename': BASE_DIR / 'debug.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'console',
        },
        'mail_admins': {
            'level': 'DEBUG',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': False,
        },
        'smtp_server': {
            'level': 'DEBUG',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': False,
        },
    },
    'loggers': {
        '': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.request': {
            'level': 'DEBUG',
            'handlers': ['file'],
            'propagate': True,
        },
        'auth': {
            'level': 'DEBUG',
            'handlers': ['auth_file', 'console'],
        },
        'smtp_server': {
            'level': 'DEBUG',
            'handlers': ['smtp_server_file', 'console'],
        },
        'order_to_email': {
            'level': 'DEBUG',
            'handlers': ['mail_admins'],
        },
    },
}
