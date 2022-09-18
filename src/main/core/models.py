from django.conf import settings
from django.db import models
from authentication.models import CustomUser

class Companies(models.Model):
    name = models.TextField(verbose_name='Наименование компании')
    inn = models.TextField(verbose_name='ИНН компании')
    kpp = models.TextField(verbose_name='КПП компании')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Компании"


class Contracts(models.Model):

    STATUS_CONTRACTS = (
           ('Заключен', 'Заключен'),
           ('Планируется', 'Планируется'),
           ('Выбор подрядчика', 'Выбор подрядчика'),
           ('Удален', 'Удален'),
           ('Завершен', 'Завершен'),
    )

    name = models.CharField(max_length=200, verbose_name='Реквизиты договора')
    entity = models.CharField(max_length=200, verbose_name='Сущность')
    status = models.CharField(max_length=50, verbose_name='Статус', default='Заключен', choices=STATUS_CONTRACTS)
    customer = models.ForeignKey(Companies, on_delete=models.CASCADE, default=None, related_name='+', null=True)
    executor = models.ForeignKey(Companies, on_delete=models.SET_NULL, default=None, related_name='+', null=True)
    cost = models.FloatField(max_length=50, verbose_name='Стоимость', default='0.0', null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Контракты"


class Messenger(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=None)
    timestamp = models.DateField(auto_now_add=True)
    text = models.TextField(verbose_name='Текст сообщения')
    contract = models.ForeignKey(Contracts, on_delete=models.SET_NULL, default=None, null=True)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = "Мессенджер"


class Devices(models.Model):

    TYPE_STATE = (
           ('Планируется', 'Планируется'),
           ('В работе', 'В работе'),
           ('В ремонте', 'В ремонте'),
           ('Списано', 'Списано'),
    )

    name = models.CharField(max_length=200, verbose_name='Наименование оборудования')
    owner = models.ForeignKey(Companies, on_delete=models.CASCADE, default=None, null=True)
    address = models.CharField(max_length=200, verbose_name='Адрес площадки')
    status = models.CharField(max_length=50, verbose_name='Статус', default='Планируется', choices=TYPE_STATE)
    contract = models.ForeignKey(Contracts, on_delete=models.SET_NULL, default=None, null=True)
    latitude = models.CharField(max_length=20, verbose_name='Широта', default='59.985431')
    longitude = models.CharField(max_length=20, verbose_name='Долгота', default='30.328338')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Оборудование"


class Actions(models.Model):

    TYPE_ACTION = (
           ('Ремонт', 'Ремонт'),
           ('Плановая', 'Плановая'),
    )

    TYPE_STATUS = (
           ('План', 'План'),
           ('В работе', 'В работе'),
           ('Выполнено', 'Выполнено'),
    )

    TYPE_CHECK = (
           ('Не принято', 'Не принято'),
           ('Принято', 'Принято'),
    )

    TYPE_PLAN = (
           ('Активен', 'Активен'),
           ('Черновик', 'Черновик'),
    )

    name = models.CharField(max_length=200, verbose_name='Наименование работ')
    date = models.CharField(max_length=200, verbose_name='Дата проведения работ')
    type = models.CharField(max_length=50, verbose_name='Тип работ', default='Плановая', choices=TYPE_ACTION)
    typePlan = models.CharField(max_length=50, verbose_name='Тип плана', default='Черновик', choices=TYPE_PLAN)
    statusExecutor = models.CharField(max_length=50, verbose_name='Статус выполнения', default='План', choices=TYPE_STATUS)
    checkCustomer = models.CharField(max_length=50, verbose_name='Принята заказчиком', default='Не принято', choices=TYPE_CHECK)
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, default=None, verbose_name='Оборудование')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "План работ"


class UserCompany(models.Model):

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=None)
    company = models.ForeignKey(Companies, on_delete=models.CASCADE, default=None)


    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Пользователи_Компании"


class Sensors(models.Model):

    name = models.CharField(max_length=200, verbose_name='Наименование датчика')
    code = models.CharField(max_length=200, verbose_name='Обозначение датчика')
    measurement = models.CharField(max_length=200, verbose_name='Единица измерения')
    min = models.CharField(max_length=200, verbose_name='Минимальное значение')
    max = models.CharField(max_length=200, verbose_name='Максимальное значение')
    value = models.CharField(max_length=200, verbose_name='Текущее значение')
    device = models.ForeignKey(Devices, on_delete=models.CASCADE, default=None, verbose_name='Оборудование', blank=True)
    measurement_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Показания датчиков"