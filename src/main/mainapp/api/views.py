from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

import random
from django.db.models import Sum

from django.db.models import Q

from datetime import datetime, timedelta, date
from django.core import mail
from django.utils import timezone
from django.conf import settings

import json
from tensorflow.keras.models import load_model

from django.http import FileResponse
from django.core.files import File
from io import BytesIO

import xml.etree.ElementTree as ET
from pathlib import Path
import os
from os import listdir
from os.path import isfile, join

from rest_framework.permissions import AllowAny, IsAuthenticated

from .serializers import (MessengerSerializer, ActionsSerializer, DevicesSerializer, CompaniesSerializer,
                          ContractsSerializer, SensorsSerializer)
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

        if (id == 'null'):
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

        if (id == 'null'):
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

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        company = Companies.objects.get(name=rData['executorName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        customer = UserCompany.objects.get(user=userId).company

        print(company)

        resp = Contracts.objects.create(name=rData['name'], entity=rData['entity'], status=rData['status'],
                                        executor=company, customer=customer, cost=rData['cost'])

        # fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")


class UpdContract(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("--------- Data --------------")
        rData = request.data
        print(rData)

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        company = Companies.objects.get(name=rData['executorName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        customer = UserCompany.objects.get(user=userId).company

        print(company)

        resp = Contracts.objects.filter(pk=rData['pk']).update(name=rData['name'], entity=rData['entity'],
                                                               status=rData['status'], executor=company,
                                                               customer=customer, cost=rData['cost'])

        # fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")


class AddDevice(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("--------- Data --------------")
        rData = request.data
        print(rData)

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        contract = Contracts.objects.get(name=rData['contractName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        owner = UserCompany.objects.get(user=userId).company

        resp = Devices.objects.create(name=rData['name'], address=rData['address'], latitude=rData['latitude'],
                                      longitude=rData['longitude'], status=rData['status'], contract=contract,
                                      owner=owner)

        # fields = ('name', 'entity', 'status', 'executor_name', 'executor_inn', 'executor_kpp')

        return Response("OK")


class UpdDevice(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("--------- Data --------------")
        rData = request.data
        print(rData)

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        contract = Contracts.objects.get(name=rData['contractName']['label'])
        userId = CustomUser.objects.get(username=rData['username'])
        owner = UserCompany.objects.get(user=userId).company

        resp = Devices.objects.filter(pk=rData['pk']).update(name=rData['name'], address=rData['address'],
                                                             latitude=rData['latitude'], longitude=rData['longitude'],
                                                             status=rData['status'], contract=contract, owner=owner)

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

        if (code == 'all'):
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
                if random.randint(1, 200) == 1 and int(old_value) / int(max) * 100 >= 98:
                    # ???????????? ???????????????????????? - ????????????
                    dict_resp['device'].status = '????????????'
                    dict_resp['device'].save()

                    # ???????????????? ???????????? ????????????
                    result_actions = Actions.objects.create(
                        name='????????????',
                        date=timezone.now().strftime('%d.%m.%Y'),
                        type='????????????',
                        typePlan='??????????????',
                        statusExecutor='?? ????????????',
                        checkCustomer='???? ??????????????',
                        device=Devices.objects.get(pk=dict_resp['device'].id)
                    )

                    # ???????????????? ?????????????????????? ???? ??????????
                    list_email_customer = []
                    list_email_executor = []
                    text_email_executor = None

                    if dict_resp['device'].contract and dict_resp['device'].contract.status == '????????????????':
                        user_company_customer = UserCompany.objects.filter(
                            company=dict_resp['device'].contract.customer)

                        for user_company in user_company_customer:
                            if user_company.user.email_user:
                                list_email_customer.append(user_company.user.email_user)
                        user_company_executor = UserCompany.objects.filter(
                            company=dict_resp['device'].contract.executor)

                        for user_company in user_company_executor:
                            if user_company.user.email_user:
                                list_email_executor.append(user_company.user.email_user)

                        if user_company_executor:
                            user_company_executor_text = f' ?????? ???????????????????? {user_company_executor[0].company.name}'
                        else:
                            user_company_executor_text = ''

                        text_email_customer = f"????????????????! ???? ???????????????????????? {dict_resp['device'].name} ???? ????????????" \
                                              f" {dict_resp['device'].address} ?????????????????? ???????????? ?????????????? {temp}. " \
                                              f"\n?????????????????????? ???????? ?????????? ??? {result_actions.id}" \
                                              f"{user_company_executor_text}" \
                                              f"{'. ???????????????????? ???????????????????? ??????????????????????' if list_email_executor else ''}"

                        text_email_executor = f"????????????????! ???? ???????????????????????? {dict_resp['device'].name} ???? ????????????" \
                                              f" {dict_resp['device'].address} ?????????????????? ???????????? ?????????????? {temp}. " \
                                              f"\n?????????????????????? ???????? ?????????? ??? {result_actions.id}"
                    else:
                        text_email_customer = f"????????????????! ???? ???????????????????????? {dict_resp['device'].name} ???? ????????????" \
                                              f" {dict_resp['device'].address} ?????????????????? ???????????? ?????????????? {temp}. " \
                                              f"\n???????? ?????????? ???? ?????? ?????????????????????? ?????? ?????? ?????? ???????????????????????? ???? ???????????????? " \
                                              f"????????????????!"

                    for email_user in list_email_customer:
                        mail.send_mail(
                            f"??????????! ???????????? ???? ???????????????????????? {dict_resp['device'].name}!",
                            text_email_customer,
                            settings.EMAIL_HOST_USER,
                            [email_user],
                            fail_silently=False,
                        )

                    for email_user in list_email_executor:
                        if text_email_executor:
                            mail.send_mail(
                                f"??????????! ???????????? ???? ???????????????????????? {dict_resp['device'].name}!",
                                text_email_executor,
                                settings.EMAIL_HOST_USER,
                                [email_user],
                                fail_silently=False,
                            )

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

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        device = Devices.objects.get(name=rData['device']['label'])

        print(device)
        resp = Actions.objects.create(name=rData['name'], date=rData['date'], statusExecutor=rData['statusExecutor'],
                                      checkCustomer=rData['checkCustomer'], type=rData['type'],
                                      typePlan=rData['typePlan'], device=device)

        return Response("OK")


class UpdPlan(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("--------- Data --------------")
        rData = request.data
        print(rData)
        print(rData['pk'])

        # company = Companies.objects.filter(name=rData['executorName']['label']).get()
        device = Devices.objects.get(name=rData['device']['label'])
        resp = Actions.objects.filter(pk=rData['pk']).update(name=rData['name'], date=rData['date'],
                                                             statusExecutor=rData['statusExecutor'],
                                                             checkCustomer=rData['checkCustomer'], type=rData['type'],
                                                             typePlan=rData['typePlan'], device=device)

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
            ?????????????? ?????????????????? ???????? ?? ????????????????????, ?????????????????? ???????????? xml ?? ???????? ???? ????????????????????
             ?? ???????????? ???? ???? ?????????????????????????? ??????????????
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

                # ?? ???????????????? ?????????????? ?????????????? ?? ???????????????? ???? ?????????? ????????????
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

                # ?????????????????? ???? ????????????????
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
                    # ?????????? ?? ???? ????????????????????
                    Sensors.objects.create(
                        name=element.attrib['string'],
                        code=element.attrib['name'],
                        measurement=element.attrib['type'],
                        min=element.attrib['min'],
                        max=element.attrib['max'],
                        value=element_text,
                        device=device if device else None,
                    )
            file.close()

        return Response("Ok")


class Report(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        resp = {}

        user_instance = CustomUser.objects.get(username=self.request.user)
        company = UserCompany.objects.get(user=user_instance).company
        # contract = Contracts.objects.filter(Q(customer=company) | Q(executor=company))

        if (request.data['report']['label'] == '??????????????????'):
            planContact = Contracts.objects.filter(Q(status='??????????????????????') & Q(customer=company)).count()
            choiceContract = Contracts.objects.filter(Q(status='?????????? ????????????????????') & Q(customer=company)).count()
            acceptContract = Contracts.objects.filter(Q(status='????????????????') & Q(customer=company)).count()
            endContract = Contracts.objects.filter(Q(status='????????????????') & Q(customer=company)).count()

            dataPie = [
                {'type': '??????????????????????', 'value': int(planContact)},
                {'type': '?????????? ????????????????????', 'value': int(choiceContract)},
                {'type': '??????????????????', 'value': int(acceptContract)},
                {'type': '??????????????????', 'value': int(endContract)},
            ]

            planCost = Contracts.objects.filter(Q(status='??????????????????????') & Q(customer=company)).aggregate(Sum('cost'))[
                'cost__sum']
            choiceCost = \
            Contracts.objects.filter(Q(status='?????????? ????????????????????') & Q(customer=company)).aggregate(Sum('cost'))[
                'cost__sum']
            acceptCost = Contracts.objects.filter(Q(status='????????????????') & Q(customer=company)).aggregate(Sum('cost'))[
                'cost__sum']
            endCost = Contracts.objects.filter(Q(status='????????????????') & Q(customer=company)).aggregate(Sum('cost'))[
                'cost__sum']

            dataColumn = [
                {'param': '??????????????????????', 'value': planCost},
                {'param': '?????????? ????????????????????', 'value': choiceCost},
                {'param': '??????????????????', 'value': acceptCost},
                {'param': '??????????????????', 'value': endCost},
            ]
            print(dataColumn)

            resp = {'dataPie': dataPie, 'dataColumn': dataColumn}

        if (request.data['report']['label'] == '????????????????????'):

            dataPie = list()
            company_all = Companies.objects.all()
            for i in company_all:
                executor = Contracts.objects.filter(status='????????????????', executor=i, customer=company).count()
                print(i.name, '   ', executor)
                if (executor != 0):
                    dataPie.append({'type': i.name, 'value': executor})

            dataColumn = list()
            company_all = Companies.objects.all()
            for i in company_all:
                executor = \
                Contracts.objects.filter(status='????????????????', executor=i, customer=company).aggregate(Sum('cost'))[
                    'cost__sum']
                print(i.name, '   ', executor)
                if (executor == None):
                    executor = 0
                if (executor != 0):
                    dataColumn.append({'param': i.name, 'value': executor})

            resp = {'dataPie': dataPie, 'dataColumn': dataColumn}

        return Response(resp)


class GetPrediction(APIView):
#    ...
#     """
#     ?????????????????? ???????????????? ???????????????? ?????????? ???????????? ???? ????????????
#     ?????????????? ???????????? ?? ?????????????? ??????????????????
#     """
    permission_classes = [IsAuthenticated]

    def get(self, request):
         # ?????????????????? ?????????????????? ??????????????????
        model_neuron = load_model('./mainapp/management/commands/weights.h5')
         # ?????????? ???????????? ?? ????????????????
        with open('./mainapp/api/state.json', 'r') as f:
            state = json.load(f)
        # ???????????????? ????????????????????????
        predict = model_neuron.predict(state['current_state'])
        # ?????????????????? ???????????? ?? ???????????????? ?????? ?????????????????? ????????????????
        state['current_state'][0][6] += 0.05
        # ???????????????????? ???????????? ?? ????????????????
        with open('./mainapp/api/state.json', 'w') as f:
            json.dump(state, f)
        # ?????????????????? ?????????? ?? ??????????????????
        result = ({'date': 0, 'temp': '?????????????????????? ????????????, %', 'value': predict[0][0]*100})
        return Response(result)