from django.contrib import admin
from .models import CustomUser

from import_export.admin import ImportExportActionModelAdmin
from import_export import resources

from django.contrib.auth.admin import UserAdmin
from django.forms import Textarea
from django.db import models

class UserAdminConfig(UserAdmin):
    model = CustomUser
    search_fields = ('username',)
    list_filter = ('username', 'fullusername', 'is_active', 'is_staff', 'role')
    ordering = ('-start_date',)
    list_display = ('username', 'fullusername', 'is_active', 'is_staff', 'email_user', 'role')
    #Позволяет изменить макет страниц добавления и редактирования объекта.
    fieldsets = (
        (None, {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_staff', 'fullusername', 'is_active', 'email_user', 'role')}),
        #('Personal', {'fields': ('about',)}),
    )

    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'row': 20, 'cols': 60})},
    }
    add_fieldsets = (
        (None, {
                'classes': ('wide',),
                'fields': ('username', 'fullusername', 'password1', 'password2', 'is_active', 'is_staff', 'email_user', 'role')
                }
        ),
    )

admin.site.register(CustomUser, UserAdminConfig)
