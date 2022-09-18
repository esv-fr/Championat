from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
#from django.conf import settings
#from django.contrib import admin

import jwt
from datetime import datetime, timedelta
#from core.models import Companies

class CustomUserManager (BaseUserManager):

    def create_superuser(self, username, password, **other_fields):
        # Создает и возввращет пользователя с привилегиями суперадмина.
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True.')
        return self.create_user(username, password, **other_fields)

    def create_user(self, username, password, **other_fields):
        # Создает и возвращает пользователя с именем и паролем.
        if not username:
            raise ValueError(_('You must provide an user name') )

        user = self.model(username=username, **other_fields)
        user.set_password(password)

        user.save()
        #user.save(using=self._db)
        return user

class CustomUser (AbstractBaseUser, PermissionsMixin):

    ROLE = (
           ('Заказчик', 'Заказчик'),
           ('Инженер (Заказчик)', 'Инженер (Заказчик)'),
           ('Аналитик (Заказчик)', 'Аналитик (Заказчик)'),
           ('Исполнитель', 'Исполнитель'),
           ('Администратор', 'Администратор'),
    )

    username = models.CharField(max_length=150, unique=True, verbose_name='Имя пользователя')
    fullusername = models.CharField(max_length=150, verbose_name='ФИО для отображения', default='-')
    start_date = models.DateTimeField(default=timezone.now)

    is_staff = models.BooleanField(default=False, verbose_name='Пользователь относится к Служебному персоналу')
    is_active = models.BooleanField(default=True, verbose_name='Не заблокирован. Активен.')

    #customer = models.CharField(max_length=150, verbose_name='Наименование ДО', default='Не задан')
    #company = models.ForeignKey(Companies, on_delete=models.CASCADE, default=None)

    email_user = models.EmailField(max_length=50, verbose_name='Email пользователя', default='Не задан')
    role = models.CharField(max_length=50, verbose_name='Роль пользователя', default='', choices=ROLE)

    USERNAME_FIELD = 'username'

    # Сообщает Django, что определенный выше класс UserManager должен управлять объектами этого типа.
    objects = CustomUserManager()

    def __str__(self):
            return self.username


#class UserCompany(models.Model):
#
#    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)
#    company = models.ForeignKey(Companies, on_delete=models.CASCADE, default=None)
#
#
#    def __str__(self):
#        return self.user.username
#
#    class Meta:
#        verbose_name = "Пользователи_Компании"