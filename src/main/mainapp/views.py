from django.shortcuts import render 

# for readness probe kubernetis
#from core.models import PageView

def index(request): 
	return render(request, 'index.html', {}) 

def services_to_dir(request, id): 
	return render(request, 'index.html', {}) 

def services_to_param(request, id):
	return render(request, 'index.html', {})

def org_to_customer(request, id):
	return render(request, 'index.html', {})

def org_to_show(request, id):
	return render(request, 'index.html', {})

def customer_to_detailservice(request, id):
	return render(request, 'index.html', {})

def req_to_detail(request, id):
	return render(request, 'index.html', {})

def arch_req_to_detail(request, id):
	return render(request, 'index.html', {})


# for readness probe kubernetis
#def health(request):
#    """Takes an request as a parameter and gives the count of pageview objects as reponse"""
#    return HttpResponse("ok") #PageView.objects.count())
