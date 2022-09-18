from django.core.management.base import BaseCommand
from authentication import models as authmodels
from core import models as coremodels

class Command(BaseCommand):
    help = 'Fullfill db'

    def handle(self, *args, **options):
        authmodels.CustomUser.objects.create_user(username='customer', fullusername='Семенов Виктор', email_user='customer@customer.com', role='Заказчик', password='external',)
        authmodels.CustomUser.objects.create_user(username='customer1', fullusername='Семенов Виктор1', email_user='customer1@customer.com', role='Заказчик', password='external', )
        authmodels.CustomUser.objects.create_user(username='customer2', fullusername='Семенов Виктор2', email_user='customer2@customer.com', role='Заказчик', password='external', )

        authmodels.CustomUser.objects.create_user(username='analyst', fullusername='Панченко Николай', email_user='analyst@analyst.com', role='Аналитик (Заказчик)', password='external', )
        authmodels.CustomUser.objects.create_user(username='analyst1', fullusername='Панченко Николай1', email_user='analyst1@analyst.com', role='Аналитик (Заказчик)', password='external', )
        authmodels.CustomUser.objects.create_user(username='analyst2', fullusername='Панченко Николай2', email_user='analyst2@analyst.com', role='Аналитик (Заказчик)', password='external', )

        authmodels.CustomUser.objects.create_user(username='engineer', fullusername='Панов Николай', email_user='engineer@engineer.com', role='Инженер (Заказчик)', password='external', )
        authmodels.CustomUser.objects.create_user(username='engineer1', fullusername='Панов Николай1', email_user='engineer1@engineer.com', role='Инженер (Заказчик)', password='external', )
        authmodels.CustomUser.objects.create_user(username='engineer2', fullusername='Панов Николай2', email_user='engineer2@engineer.com', role='Инженер (Заказчик)', password='external', )

        authmodels.CustomUser.objects.create_user(username='executor', fullusername='Викторов Дмитрий', email_user='executor@executor.com', role='Исполнитель', password='external',)
        authmodels.CustomUser.objects.create_user(username='executor1', fullusername='Викторов Дмитрий1', email_user='executor1@executor.com', role='Исполнитель', password='external', )
        authmodels.CustomUser.objects.create_user(username='executor2', fullusername='Викторов Дмитрий2', email_user='executor2@executor.com', role='Исполнитель', password='external', )

        coremodels.Companies.objects.create(name='---------------------', inn='100000000', kpp='100000000', )
        coremodels.Companies.objects.create(name='Для выбора подрядчика', inn='000000000', kpp='000000000', )

        coremodels.Companies.objects.create(name='Газпром ПАО', inn='11111111', kpp='11111111',)
        coremodels.Companies.objects.create(name='Газпромнефть ПАО', inn='2222222222', kpp='2222222222',)
        coremodels.Companies.objects.create(name='Лукойл ПАО', inn='3333333333', kpp='33333333333', )

        coremodels.Companies.objects.create(name='Метрика ООО', inn='444444444',kpp='4444444444',)
        coremodels.Companies.objects.create(name='ИТ-сервис ООО', inn='5555555555', kpp='555555555',)
        coremodels.Companies.objects.create(name='ИТ консалт ООО', inn='66666666666', kpp='6666666666', )

        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=1), company=coremodels.Companies.objects.get(pk=3))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=2), company=coremodels.Companies.objects.get(pk=4))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=3), company=coremodels.Companies.objects.get(pk=5))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=4), company=coremodels.Companies.objects.get(pk=3))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=5), company=coremodels.Companies.objects.get(pk=4))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=6), company=coremodels.Companies.objects.get(pk=5))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=7), company=coremodels.Companies.objects.get(pk=3))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=8), company=coremodels.Companies.objects.get(pk=4))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=9), company=coremodels.Companies.objects.get(pk=5))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=10), company=coremodels.Companies.objects.get(pk=6))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=11), company=coremodels.Companies.objects.get(pk=7))
        coremodels.UserCompany.objects.create(user=authmodels.CustomUser.objects.get(pk=12), company=coremodels.Companies.objects.get(pk=8))

        coremodels.Contracts.objects.create(name='20-20/4 от 23.02.2022', cost=21324.22, entity='Ремонт установки', status='Планируется', customer=coremodels.Companies.objects.get(pk=4), executor=coremodels.Companies.objects.get(pk=1), )
        coremodels.Contracts.objects.create(name='17-22/309 от 15.02.2022', cost=1213.22, entity='Поддержка установки', status='Выбор подрядчика', customer=coremodels.Companies.objects.get(pk=4), executor=coremodels.Companies.objects.get(pk=2), )
        coremodels.Contracts.objects.create(name='10-20/32 от 13.02.2022', cost=20413.22, entity='Обслуживание установки', status='Заключен', customer=coremodels.Companies.objects.get(pk=4), executor=coremodels.Companies.objects.get(pk=6), )
        coremodels.Contracts.objects.create(name='19-30/322 от 13.02.2022', cost=20213.22, entity='Обслуживание установки', status='Заключен', customer=coremodels.Companies.objects.get(pk=4), executor=coremodels.Companies.objects.get(pk=7), )
        coremodels.Contracts.objects.create(name='40-50/3012 от 13.02.2022', cost=12013.22, entity='Обслуживание установки', status='Завершен', customer=coremodels.Companies.objects.get(pk=4), executor=coremodels.Companies.objects.get(pk=7), )

        coremodels.Devices.objects.create(name='Буровая 1', owner=coremodels.Companies.objects.get(pk=3), address='Тюмень, Профсоюзная 17', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 2', owner=coremodels.Companies.objects.get(pk=3), address='Коломна, Октябрьская 27', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 3', owner=coremodels.Companies.objects.get(pk=3), address='Москва, Китаева 9', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 4', owner=coremodels.Companies.objects.get(pk=3), address='Ноябрьск, Наросова 17', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 5', owner=coremodels.Companies.objects.get(pk=3), address='Хантымансийск, Кировская 1', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 6', owner=coremodels.Companies.objects.get(pk=3), address='Анадырь, Укосова 3', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))
        coremodels.Devices.objects.create(name='Буровая 7', owner=coremodels.Companies.objects.get(pk=3), address='Калуга, Ленина 4', status='В работе', contract=coremodels.Contracts.objects.get(pk=3))

        coremodels.Actions.objects.create(name='Обслуживание', date='12.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='13.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='14.12.2022', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='15.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='16.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='17.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=2))
        coremodels.Actions.objects.create(name='Обслуживание', date='18.12.2022', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=2))
        coremodels.Actions.objects.create(name='Обслуживание', date='19.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=3))
        coremodels.Actions.objects.create(name='Обслуживание', date='20.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=3))
        coremodels.Actions.objects.create(name='Обслуживание', date='21.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=4))
        coremodels.Actions.objects.create(name='Обслуживание', date='22.12.2022', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=4))
        coremodels.Actions.objects.create(name='Обслуживание', date='23.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=5))
        coremodels.Actions.objects.create(name='Обслуживание', date='24.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=5))
        coremodels.Actions.objects.create(name='Обслуживание', date='25.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=6))
        coremodels.Actions.objects.create(name='Обслуживание', date='26.12.2022', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=6))
        coremodels.Actions.objects.create(name='Обслуживание', date='27.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=7))
        coremodels.Actions.objects.create(name='Обслуживание', date='28.12.2022', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=7))
        coremodels.Actions.objects.create(name='Обслуживание', date='01.01.2023', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=7))
        coremodels.Actions.objects.create(name='Обслуживание', date='04.01.2023', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='05.02.2023', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='12.03.2023', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='13.04.2023', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='14.04.2023', type='Ремонт', typePlan='Активен', statusExecutor='В работе', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
        coremodels.Actions.objects.create(name='Обслуживание', date='15.06.2023', type='Плановая', typePlan='Черновик', statusExecutor='План', checkCustomer='Не принято', device=coremodels.Devices.objects.get(pk=1))
