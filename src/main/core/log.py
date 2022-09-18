#Для записи лога, отслеживающего вход, выход и неудачные попытки входя пользователей в ЛК


import logging
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_faled
from django.dispatch import receiver

logger = logging.getLogger('auth')

@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    ip = request.META.get('REMOTE_ADDR')

    logger.debug('login user: {user} via ip: {ip}'.format(user=user, ip=ip))

@receiver(user_logged_out)
def user_logged_out_callback(sender, request, user, **kwargs):
    ip = request.META.get('REMOTE_ADDR')

    logger.debug('logout user: {user} via ip: {ip}'.format(user=user, ip=ip))

@receiver(user_login_faled)
def user_login_failed_callback(sender, credentials, **kwargs):
    logging.warning('login failed for: {credentials}'.format(credentials=credentials))

