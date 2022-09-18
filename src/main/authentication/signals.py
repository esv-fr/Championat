import logging
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver #, Signal
from .models import CustomUser

logger = logging.getLogger('auth')

#signal = Signal()

@receiver(user_logged_in, sender=CustomUser)
def log_user_login(sender, request, user, **kawargs):
#    print('user log in (from signals.py)')
    logger.debug('Auth: YES log in')

@receiver(user_login_failed, sender=CustomUser)
def log_user_login_failed(sender, credentials, request, **kwargs):
    logger.error('Auth: NO login failed (from signals.py)')

@receiver(user_logged_out, sender=CustomUser)
def log_user_logout(sender, request, user, **kwargs):
    logger.debug('Auth: NO log out (from signals.py)')
