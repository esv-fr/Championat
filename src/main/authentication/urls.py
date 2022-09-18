# /authentication/urls.py
from django.urls import path
from .views import UserLoginView, current_user

from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token

app_name = 'authentication'

urlpatterns = [
    # Обновление, получение инфы о пользователе
#    path('user/', UserRetrieveUpdateAPIView.as_view()),
    # Заведение нового пользователя
#    path('users/', RegistrationAPIView.as_view()),
    #  Логин
    path('login/', UserLoginView.as_view()),
    path('current-user/', current_user),
#    path('verify/', verify_jwt_token),
#    path('token/', obtain_jwt_token),
]

#logger.debug(urlpatterns)
