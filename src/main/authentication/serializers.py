# /authentication/serializers.py
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from .models import CustomUser
from core.models import UserCompany

import logging
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver
import datetime

#logger = logging.getLogger('auth')

JWT_PAYLOAD_HANDLER = api_settings.JWT_PAYLOAD_HANDLER
JWT_ENCODE_HANDLER = api_settings.JWT_ENCODE_HANDLER

# Мы написали пользовательский метод проверки, чтобы проверить пользователя и вернуть токен.
# Аутентификация используется для аутентификации пользователя, т.е. проверки учетных данных пользователя.
# Если пользователь не прошел проверку подлинности или не существует, это вызывает ошибку.
# Если пользователь аутентифицирован, он передается в качестве полезной нагрузки в JWT_PAYLOAD_HANDLER,
# а затем токен генерируется путем кодирования полезной нагрузки, которая передается в качестве аргумента в JWT_ENCODE_HANDLER.

class UserLoginSerializer(serializers.Serializer):

    #email = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=255)
    #fullusername = serializers.CharField(max_length=255)
    company = serializers.CharField(max_length=255, read_only=True)

    role = serializers.CharField(max_length=255, read_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        #email = data.get("email", None)
        username = data.get("username", None)
        password = data.get("password", None)

#        user = authenticate(username=username, password=password)

        # Счетчик неудачно введенного пароля
#        counter = 0
#        while counter <= 3:
        try:
            company = UserCompany.objects.filter(user__username=username).get().company
            #fullusername = CustomUser.objects.filter(username=username).values('fullusername').get()
            role = CustomUser.objects.filter(username=username).values('role').get()
#                while counter <= 3:
#                if password is not CustomUser.objects.filter(username=user).values('password').get():
#                    raise serializers.ValidationError('incorrect password for user ' + username)
#                    counter = counter + 1
#                        converted_counter = str(counter)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('User does not exist: ' + username) # + ' | counter: ' + str(counter))
#                counter = counter + 1

        user = authenticate(username=username, password=password)

        # Проверка, аутентификация прошла успешно
#        print(user)
        if user is not None:
            if user.is_active:
#                 message = datetime.datetime.now().strftime("%d-%m-%Y %H:%M") + ' | Auth: YES | ' + username
#                 logger.debug(datetime.datetime.now().strftime("%d-%m-%Y %H:%M")+' | Auth: YES | ' + username)
                print('works')
            else:
#                 message = datetime.datetime.now().strftime("%d-%m-%Y %H:%M") + ' Auth: NO | disabled ' + username
#                 logger.error(datetime.datetime.now().strftime("%d-%m-%Y %H:%M")+ ' | Auth: NO |  disabled ' + username)
                message = 'User with given username  ' + username + '   is disable'
                raise serializers.ValidationError(message, code = 100)
        else:
#             message = datetime.datetime.now().strftime("%d-%m-%Y %H:%M") + ' | Auth: NO | user not found'
#             logger.debug(datetime.datetime.now().strftime("%d-%m-%Y %H:%M")+' | Auth: NO | user ', data.get("username", None), ' not found')
            message = 'User with given username ' + username + ' and password does not exists - password failed'
            raise serializers.ValidationError(message, code = 101)

        try:
#            logger.debug(message)
#            logger.debug(datetime.datetime.now().strftime("%d-%m-%Y %H:%M")+ ' | Auth: YES ' + username)
            payload = JWT_PAYLOAD_HANDLER(user)
            jwt_token = JWT_ENCODE_HANDLER(payload)
            update_last_login(None, user)
#            customer=CustomUser.objects.filter(username=user).values('customer').get()
        except CustomUser.DoesNotExist:
            message = 'Process JWT Payload for [' + username + '] error'
            raise serializers.ValidationError(message, code = 102)
        return {
            'username': user.username,
            #'fullusername': fullusername['fullusername'],
            'token': jwt_token,
            'company': company,
            'role': role['role']
        }


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ('username', 'fullusername', 'role')
