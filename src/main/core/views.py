from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import Services


def services_list(request):
    services = Services.objects.filter(published='True')
    return render(request, 'blog/services_list.html', {'services': services})


def service_detail(request, pk):
    service = get_object_or_404(Services, pk=pk)
    return render(request, 'blog/services_detail.html', {'service': service})

