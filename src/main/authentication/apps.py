
from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    def ready(self):
        import authentication.signals
#        from .signals import log_user_login, log_user_login_failed, log_user_logout


#регистрация настраиваемой конфигурации приложения django
default_app_config = 'authentication.AuthenticationConfig'
