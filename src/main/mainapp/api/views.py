from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

import random
from django.db.models import Sum

from django.db.models import Q

from datetime import datetime, timedelta, date
import json

from django.http import FileResponse
from django.core.files import File
from io import BytesIO

import xml.etree.ElementTree as ET
from pathlib import Path
import os
from os import listdir
from os.path import isfile, join

from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (MessengerSerializer, ActionsSerializer, DevicesSerializer, CompaniesSerializer, ContractsSerializer, SensorsSerializer)
from core.models import Messenger, Devices, Companies, Actions, Contracts, UserCompany, Sensors
from authentication.models import CustomUser

class MessengerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        id = request.GET.get('id', 'null')

        if (id == 'null'):
            queryset = Messenger.objects.all()
            serializer = MessengerSerializer(queryset, many=True)
        else:
            contract = Contracts.objects.get(pk=id)
            queryset = Messenger.objects.filter(contract=contract)
            serializer = MessengerSerializer(queryset, many=True)

        return Response(serializer.data)


class SensorsViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        queryset = Sensors.objects.order_by('name').distinct('name')
        serializer = SensorsSerializer(queryset, many=True)

        return Response(serializer.data)


class ActionsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Actions.objects.all()
    serializer_class = ActionsSerializer


class DevicesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        id = request.GET.get('id', 'null')
        print('Params devices: ', id)

        if(id=='null'):
            user_instance = CustomUser.objects.get(username=self.request.user)
            company = UserCompany.objects.get(user=user_instance).company
            contract = Contracts.objects.filter(Q(customer=company) | Q(executor=company))

            queryset = Devices.objects.filter(contract__in=contract)
            serializer = DevicesSerializer(queryset, many=True)
        else:
            contract = Contracts.objects.get(pk=id)
            queryset = Devices.objects.filter(contract=contract)
            serializer = DevicesSerializer(queryset, many=True)

        return Response(serializer.data)


class PlanViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        id = request.GET.get('id', 'null')
        print('Params devices: ', id)

        if(id=='null'):
            queryset = Actions.objects.all()
            serializer = ActionsSerializer(queryset, many=True)
        else:
            device = Devices.objects.get(pk=id)
            queryset = Actions.objects.filter(device=device)
            serializer = ActionsSerializer(queryset, many=True)

        return Response(serializer.data)


class CompaniesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Companies.objects.all()
    serializer_class = CompaniesSerializer

class ContractsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Contracts.objects.all()
    serializer_class = ContractsSerializer

    def get_queryset(self):
        queryset = self.queryset

        user_instance = CustomUser.objects.get(username=self.request.user)
        print('user:', user_instance, '  ', self.request.user)
        company = UserCompany.objects.get(user=user_instance).company

        query_set = queryset.filter(Q(customer=company) | Q(executor=company))
        return query_set

class AddContract(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print(request.__dict__)
        print("-------- Headers -----------")
        print(request.headers)
        print("--------- Data --------------")
        rData = request.data
        print(rData)

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        company = Companies.objects.get(name=rData['executorName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        customer = UserCompany.objects.get(user=userId).company

        print(company)

        resp = Contracts.objects.create(name=rData['name'], entity=rData['entity'], status=rData['status'], executor=company, customer=customer, cost=rData['cost'])


        #fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")

class UpdContract(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        print(rData)

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        company = Companies.objects.get(name=rData['executorName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        customer = UserCompany.objects.get(user=userId).company

        print(company)

        resp = Contracts.objects.filter(pk=rData['pk']).update(name=rData['name'], entity=rData['entity'], status=rData['status'], executor=company, customer=customer, cost=rData['cost'])


        #fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")


class AddDevice(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        print(rData)

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        contract = Contracts.objects.get(name=rData['contractName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        owner = UserCompany.objects.get(user=userId).company

        resp = Devices.objects.create(name=rData['name'], address=rData['address'], latitude=rData['latitude'], longitude=rData['longitude'], status=rData['status'], contract=contract, owner=owner)

        #fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")

class UpdDevice(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        print(rData)

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        contract = Contracts.objects.get(name=rData['contractName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        owner = UserCompany.objects.get(user=userId).company

        resp = Devices.objects.filter(pk=rData['pk']).update(name=rData['name'], address=rData['address'], latitude=rData['latitude'], longitude=rData['longitude'], status=rData['status'], contract=contract, owner=owner)

        return Response("OK")


class SendTextMessenger(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        username = request.data['username']
        pk = request.data['pk']
        print(username, '  -----  ', pk)
        author = CustomUser.objects.get(username=username)
        contract = Contracts.objects.get(pk=pk)
        resp = Messenger.objects.create(text=rData['text'], author=author, contract=contract)
        print(resp)
        return Response("OK")

class Monitoring(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        print("--------- Data --------------")

        id = request.GET.get('id')
        code = request.GET.get('code')

        resp = list()

        if(code=='all'):
            listValue = Sensors.objects.all()
        else:
            listValue = Sensors.objects.filter(code=code)

        temp_max_min = {}

        for i in listValue:
            temp = str(i.name)
            if temp not in temp_max_min:
                min = i.min
                max = i.max
                temp_max_min.update({temp: [min, max]})

            resp.append({'date': i.measurement_date, 'temp': temp, 'value': float(i.value), 'device': i.device})

        new_resp = []
        for i in range(1, 61):
            for dict_resp in resp:
                temp = dict_resp['temp']

                mix, max = temp_max_min[temp]
                old_value = dict_resp['value']
                new_value = random.randint(int(old_value), int(max))
                if int(old_value) / int(max) * 100 >= 98:
                    # статус оборудования - в ремонте
                    # TODO - уточнить
                    dict_resp['device'].status = 'Авария'
                    dict_resp['device'].save()

                old_date = dict_resp['date']
                datetime_format = '%Y-%m-%d'
                change_date = old_date - timedelta(days=i)
                new_date = change_date.strftime(datetime_format)

                new_resp.append({'date': new_date, 'temp': temp, 'value': float(new_value)})

        return Response(new_resp)


class AddPlan(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        print(rData)

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        device = Devices.objects.get(name=rData['device']['label'])

        print(device)
        resp = Actions.objects.create(name=rData['name'], date=rData['date'], statusExecutor=rData['statusExecutor'], checkCustomer=rData['checkCustomer'], type=rData['type'], typePlan=rData['typePlan'], device=device)

        return Response("OK")


class UpdPlan(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        print("--------- Data --------------")
        rData = request.data
        print(rData)
        print(rData['pk'])

        #company = Companies.objects.filter(name=rData['executorName']['label']).get()
        device = Devices.objects.get(name=rData['device']['label'])
        resp = Actions.objects.filter(pk=rData['pk']).update(name=rData['name'], date=rData['date'], statusExecutor=rData['statusExecutor'], checkCustomer=rData['checkCustomer'], type=rData['type'], typePlan=rData['typePlan'], device=device)

        return Response("OK")


class DownloadFile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):  # , *args, **kwargs):
        fileName = request.data['filename']
        return FileResponse(open(fileName, 'rb'))


class UploadFile(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('UploadFile:', request.data['path'])
        for file_entry in request.FILES.getlist('files'):
            # uploaded_file_name = file_entry.name
            uploaded_file_content = file_entry.read()
            file = File.open(BytesIO(uploaded_file_content))

            file_out = open(str(request.data['path']), 'wb')
            file_out.write(file.read())
            file.close()
            file_out.close()

        return Response("Ok")


class UploadXmlWITSML(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
            Функция загружает файл в директорию, фильтрует только xml в этой же дириктории
             и парсит их по определенному шаблону
        """
        print('UploadXmlWITSML:')
        for file_entry in request.FILES.getlist('files'):
            uploaded_file_content = file_entry.read()
            file = File.open(BytesIO(uploaded_file_content))

            tree = ET.parse(file)
            root_tree_1 = tree.getroot()
            complex_type = root_tree_1.find('complexType')
            device_name = complex_type.attrib['name']
            device = Devices.objects.get(name=device_name)

            for element in complex_type.findall('element'):

                # в значении удаляем пробелы и переходы на новую строку
                element_text = element.text
                try:
                    element_text = int(element_text)
                except ValueError:
                    try:
                        element_text = element_text.replace(',', '.')
                        element_text = float(element_text)
                    except ValueError:
                        element_text = element_text.replace(' ', '')
                        try:
                            element_text = int(element_text)
                        except ValueError:
                            element_text = element_text.replace(',', '.')
                            element_text = float(element_text)

                # проверяем на дубликат
                result = Sensors.objects.filter(
                    name=element.attrib['string'],
                    code=element.attrib['name'],
                    measurement=element.attrib['type'],
                    min=element.attrib['min'],
                    max=element.attrib['max'],
                    value=element_text,
                    device=device,
                )
                if not result:
                    # пишем в БД информацию
                    Sensors.objects.create(
                        name=element.attrib['string'],
                        code=element.attrib['name'],
                        measurement=element.attrib['type'],
                        min=element.attrib['min'],
                        max=element.attrib['max'],
                        value=element_text,
                        device=device if device else None,
                    )
            # file_out = open(str(request.data['path']), 'wb')
            # file_out.write(file.read())
            file.close()
            # file_out.close()
        """mypath, filename = os.path.split(request.data['path'])
        all_xml_files = [f for f in listdir(mypath) if isfile(join(mypath, f)) and f.endswith('.xml')]
        # TODO: добавить обработку кейса когда такого девайса нет в  line 435, in get
        # TODO: добавить защиту от дубликатов
        for file in all_xml_files:
            tree = ET.parse(mypath + '/' + str(file))
            root_tree_1 = tree.getroot()
            complex_type = root_tree_1.find('complexType')
            device_name = complex_type.attrib['name']
            device = Devices.objects.get(name=device_name)

            for element in complex_type.findall('element'):

                # в значении удаляем пробелы и переходы на новую строку
                element_text = element.text
                try:
                    element_text = int(element_text)
                except ValueError:
                    try:
                        element_text = element_text.replace(',', '.')
                        element_text = float(element_text)
                    except ValueError:
                        element_text = element_text.replace(' ', '')
                        try:
                            element_text = int(element_text)
                        except ValueError:
                            element_text = element_text.replace(',', '.')
                            element_text = float(element_text)

                # пишем в БД информацию
                Sensors.objects.create(
                    name=element.attrib['string'],
                    code=element.attrib['name'],
                    measurement=element.attrib['type'],
                    min=element.attrib['min'],
                    max=element.attrib['max'],
                    value=element_text,
                    device=device if device else None,
                )"""

        return Response("Ok")


class Report(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        resp = {}

        user_instance = CustomUser.objects.get(username=self.request.user)
        company = UserCompany.objects.get(user=user_instance).company
        #contract = Contracts.objects.filter(Q(customer=company) | Q(executor=company))

        if(request.data['report']['label']=='Контракты'):

            planContact = Contracts.objects.filter(Q(status='Планируется') & Q(customer=company)).count()
            choiceContract = Contracts.objects.filter(Q(status='Выбор подрядчика') & Q(customer=company)).count()
            acceptContract = Contracts.objects.filter(Q(status='Заключен') & Q(customer=company)).count()
            endContract = Contracts.objects.filter(Q(status='Завершен') & Q(customer=company)).count()

            dataPie = [
                {'type': 'Планируется', 'value': int(planContact)},
                {'type': 'Выбор подрядчика', 'value': int(choiceContract)},
                {'type': 'Заключено', 'value': int(acceptContract)},
                {'type': 'Завершено', 'value': int(endContract)},
            ]

            planCost = Contracts.objects.filter(Q(status='Планируется') & Q(customer=company)).aggregate(Sum('cost'))['cost__sum']
            choiceCost = Contracts.objects.filter(Q(status='Выбор подрядчика') & Q(customer=company)).aggregate(Sum('cost'))['cost__sum']
            acceptCost = Contracts.objects.filter(Q(status='Заключен') & Q(customer=company)).aggregate(Sum('cost'))['cost__sum']
            endCost = Contracts.objects.filter(Q(status='Завершен') & Q(customer=company)).aggregate(Sum('cost'))['cost__sum']

            dataColumn = [
                {'param': 'Планируется', 'value': planCost},
                {'param': 'Выбор подрядчика', 'value': choiceCost},
                {'param': 'Заключено', 'value': acceptCost},
                {'param': 'Завершено', 'value': endCost},
            ]
            print(dataColumn)

            resp = {'dataPie': dataPie, 'dataColumn': dataColumn}

        if (request.data['report']['label'] == 'Подрядчики'):

            dataPie = list()
            company_all = Companies.objects.all()
            for i in company_all:
                    executor = Contracts.objects.filter(status='Заключен', executor=i, customer=company).count()
                    print(i.name, '   ', executor)
                    if(executor!=0):
                        dataPie.append({'type': i.name, 'value': executor})

            dataColumn = list()
            company_all = Companies.objects.all()
            for i in company_all:
                executor = Contracts.objects.filter(status='Заключен', executor=i, customer=company).aggregate(Sum('cost'))['cost__sum']
                print(i.name, '   ', executor)
                if(executor==None):
                    executor=0
                if(executor!=0):
                    dataColumn.append({'param': i.name, 'value': executor})

            resp = {'dataPie': dataPie, 'dataColumn': dataColumn}

        return Response(resp)