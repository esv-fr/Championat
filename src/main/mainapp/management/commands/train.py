from keras.models import Sequential
from keras.models import load_model
from keras.layers import Dense, Dropout
from sklearn.model_selection import train_test_split
import numpy

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Функция тренировки нейронной сети'

    def handle(self, *args, **options):
#         """
#         Функция тренировки нейронной сети. Вызывается периодически
#         при накоплении новых данных в train_dataset
#         """
        # случайное значение воспроизводимости
        numpy.random.seed(2)

        # загружаем датасет из файла
        dataset = numpy.loadtxt("train_dataset.csv", delimiter=",")

        X = dataset[:,0:8]
        Y = dataset[:,8]

        # разделяем Х, У на тренировочный и тестовый датасет
        x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

        # создание модели и добавление слоёв. Нейронная сеть будет иметь плотную структуру –
        # каждый нейрон связан со всеми нейронами следующего слоя. Выходной слой будет состоять
        # из единственного нейрона, определяющего вероятность текущего состояние Авария / Работа.
        # Для входного слоя указывается число признаков input_dim, равное 8 (т.к. в датасете 8 параметров)
        # первый аргумент в слое - количество нейронов
        model = Sequential()
        model.add(Dense(15, input_dim=8, activation='relu')) # входной слой
        model.add(Dense(10, activation='relu'))
        model.add(Dense(8, activation='relu'))
        model.add(Dropout(.2))
        model.add(Dense(1, activation='sigmoid')) # сигмовидная функция relu для конечной вероятности между 0 и 1

        # создается модель с использованием градиентного спуска
        model.compile(loss="binary_crossentropy", optimizer="adam", metrics=['accuracy'])

        # тренируем сеть
        model.fit(x_train, y_train, epochs = 1000, batch_size=20, validation_data=(x_test, y_test))

        # сохраняем модель
        model.save('./weights.h5')
