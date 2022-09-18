from django.contrib import admin
from django.urls import path, include, re_path 
from mainapp.views import index, services_to_dir, services_to_param, org_to_customer, org_to_show, customer_to_detailservice, req_to_detail, arch_req_to_detail
from rest_framework_jwt.views import obtain_jwt_token 

urlpatterns = [
    path('admin/', admin.site.urls), path('', index), 
    path('api-auth/', include('authentication.urls', namespace='authentication')), 
    path('api/', include('mainapp.api.urls')), 

    path('contracts', index),
    path('monitoring', index),
    path('messenger', index),
    path('devices', index),
    path('plan', index),
    path('reports', index),
    path('control', index),
    path('about', index),
    path('controlengineer', index),
]

