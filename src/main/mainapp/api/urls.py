from rest_framework import routers
from django.urls import path

from .views import (GetPrediction, MessengerViewSet, ContractsViewSet, ActionsViewSet, DevicesViewSet, CompaniesViewSet, PlanViewSet, \
                    AddContract, UpdContract, AddDevice, UpdDevice, SendTextMessenger, Monitoring, AddPlan, UpdPlan, \
                    DownloadFile, UploadFile, UploadXmlWITSML, SensorsViewSet, Report)

router = routers.SimpleRouter()
router.register('messenger', MessengerViewSet, basename='messenger')
router.register('companies', CompaniesViewSet, basename='companies')
router.register('actions', ActionsViewSet, basename='actions')
router.register('devices', DevicesViewSet, basename='devices')
router.register('plan', PlanViewSet, basename='devices')
router.register('contracts', ContractsViewSet, basename='contracts')
router.register('typesensors', SensorsViewSet, basename='sensors')

urlpatterns = [
    path('addcontracts/', AddContract.as_view()),
    path('updcontracts/', UpdContract.as_view()),
    path('adddevices/', AddDevice.as_view()),
    path('upddevices/', UpdDevice.as_view()),
    path('addplan/', AddPlan.as_view()),
    path('updplan/', UpdPlan.as_view()),
    path('sendtext/', SendTextMessenger.as_view()),
    path('monitoring/', Monitoring.as_view()),
    path('download/', DownloadFile.as_view()),
    path('upload_xml_witsml/', UploadXmlWITSML.as_view()),
    path('upload/', UploadFile.as_view()),
    path('reports/', Report.as_view()),
    path('getprediction/', GetPrediction.as_view()),
]

urlpatterns +=router.urls
