# /authentication/views.py

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from rest_framework import status
from rest_framework_jwt.views import verify_jwt_token

from rest_framework.views import status, APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserLoginSerializer, UserSerializer

from core.models import UserCompany

import datetime
import logging
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver


#from logging import FileHandler, Formatter
#import sys

logger = logging.getLogger('auth')



# Возвращает сгенерированный токен для пользователя
class UserLoginView(RetrieveAPIView):

    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer


    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        # Проверка, что аутентификация прошла успешно
        if serializer.is_valid():
            print('Data: ', serializer.data)
            response = {
                'success': 'True',
                'status code': status.HTTP_200_OK,
                'message': 'User logged in  successfully',
                'token': serializer.data['token'],
                'username': serializer.data['username'],
                #'fullusername': serializer.data['fullusername'],
                'company': serializer.data['company'],
                'role': serializer.data['role'],
            }
            status_code = status.HTTP_200_OK
            message = datetime.datetime.now().strftime("%d-%m-%Y %H:%M") + ' | Auth: YES ' + '| Username: ' + response['username'] + '| Company: ' + response['company']
            logger.debug(message)
            return Response(response, status=status_code)
        else:
            err_mess = "Test: "
            message = datetime.datetime.now().strftime("%d-%m-%Y %H:%M") + ' | Auth: NO ' + '| Username: ' + '| Error: ' +  err_mess.join(serializer.errors['non_field_errors'])
            logger.error(message)
            return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
#@permission_classes((IsAuthenticated, ))
@authentication_classes((JSONWebTokenAuthentication,))
@permission_classes((AllowAny, ))
def current_user(request):
    # Определяет пользователя по его токену и возвращает данные (имя пользоватея и наименование ДО)
    serializer = UserSerializer(request.user)
    response = serializer.data
    status_code = status.HTTP_200_OK

    response['company'] = UserCompany.objects.filter(user__username=request.user).get().company.name
    print(response)

    return Response(response, status=status_code)

@receiver(user_login_failed, sender=UserLoginSerializer)
def user_login_failed_callback(sender, credentials, **kwargs):
    logging.warning('login failed for: {credentials} (signals, views)'.format(credentials=credentials))

