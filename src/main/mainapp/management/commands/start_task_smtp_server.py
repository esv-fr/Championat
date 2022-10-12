# -*- encoding: utf-8 -*-

from django_celery_beat.models import PeriodicTask, IntervalSchedule
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):

    def handle(self, *args, **options):
        """
        Функция создает задачу в планировщике
        """
        print('Функция создает задачу в планировщике:', IntervalSchedule)
        interval, _ = IntervalSchedule.objects.get_or_create(every=10, period='seconds')
        PeriodicTask.objects.create(
            name='start_smtp_server',
            task='start_smtp_server',
            interval=interval,
            start_time=timezone.now(),
        )
