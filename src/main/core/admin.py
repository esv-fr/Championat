from django.contrib import admin

from import_export.admin import ImportExportActionModelAdmin
from import_export import resources
from import_export import fields
from import_export.widgets import ForeignKeyWidget

from .models import (
    Messenger,
    Actions,
    Devices,
    Contracts,
    Companies,
    UserCompany,
    Sensors,
)


class MessengerResource(resources.ModelResource):
    class Meta:
        model = Messenger

class MessengerAdmin(ImportExportActionModelAdmin):
    resource_class = MessengerResource
    list_display = [field.name for field in Messenger._meta.fields if field.name !="id"]


class ActionsResource(resources.ModelResource):
    class Meta:
        model = Actions

class ActionsAdmin(ImportExportActionModelAdmin):
    resource_class = ActionsResource
    list_display = [field.name for field in Actions._meta.fields if field.name !="id"]


class DevicesResource(resources.ModelResource):
    class Meta:
        model = Devices

class DevicesAdmin(ImportExportActionModelAdmin):
    resource_class = DevicesResource
    list_display = [field.name for field in Devices._meta.fields if field.name !="id"]


class ContractsResource(resources.ModelResource):
    class Meta:
        model = Contracts

class ContractsAdmin(ImportExportActionModelAdmin):
    resource_class = ContractsResource
    list_display = [field.name for field in Contracts._meta.fields if field.name !="id"]


class CompaniesResource(resources.ModelResource):
    class Meta:
        model = Companies

class CompaniesAdmin(ImportExportActionModelAdmin):
    resource_class = CompaniesResource
    list_display = [field.name for field in Companies._meta.fields if field.name !="id"]

class UserCompanyResource(resources.ModelResource):
    class Meta:
        model = UserCompany

class UserCompanyAdmin(ImportExportActionModelAdmin):
    resource_class = UserCompanyResource
    list_display = [field.name for field in UserCompany._meta.fields if field.name !="id"]


class SensorsResource(resources.ModelResource):
    class Meta:
        model = Sensors


class SensorsAdmin(ImportExportActionModelAdmin):
    resource_class = SensorsResource
    list_display = [field.name for field in Sensors._meta.fields if field.name !="id"]

admin.site.register(UserCompany, UserCompanyAdmin)
admin.site.register(Messenger, MessengerAdmin)
admin.site.register(Actions, ActionsAdmin)
admin.site.register(Devices, DevicesAdmin)
admin.site.register(Companies, CompaniesAdmin)
admin.site.register(Contracts, ContractsAdmin)
admin.site.register(Sensors, SensorsAdmin)