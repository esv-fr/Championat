from rest_framework import serializers
from core.models import Messenger, Devices, Actions, Companies, Contracts, Sensors


class MessengerSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username')
    class Meta:
        model = Messenger
        fields = ('author', 'timestamp', 'text', 'author_name')


class ContractsSerializer(serializers.ModelSerializer):
    executor_name = serializers.CharField(source='executor.name')
    executor_inn = serializers.CharField(source='executor.inn')
    executor_kpp = serializers.CharField(source='executor.kpp')
    customer_name = serializers.CharField(source='customer.name')
    class Meta:
        model = Contracts
        fields = ('name', 'entity', 'status', 'customer_name', 'executor_name', 'executor_inn', 'executor_kpp', 'pk', 'cost')

#class ContractsCreateSerializer(serializers.ModelSerializer):
#
#    class Meta:
#        model = Contracts
#        fields = '__all__'

class DevicesSerializer(serializers.ModelSerializer):
    contract_name = serializers.CharField(source='contract.name')
    contract_id = serializers.CharField(source='contract.pk')
    executor_name = serializers.CharField(source='contract.executor.name')
    customer_name = serializers.CharField(source='contract.customer.name')

    class Meta:
        model = Devices
        fields = ('name', 'address', 'status', 'contract_name', 'contract_id', 'executor_name', 'customer_name', 'pk', 'latitude', 'longitude')


class SensorsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sensors
        fields = ('name', 'code')


class ActionsSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name')
    class Meta:
        model = Actions
        fields = ('name', 'date', 'type', 'statusExecutor', 'checkCustomer', 'typePlan', 'device_name', 'pk')


class CompaniesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Companies
        fields = '__all__'