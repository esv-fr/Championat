import xml.etree.ElementTree as ET
from pathlib import Path
from os import listdir
from os.path import isfile, join

from django.core.management.base import BaseCommand
from core.models import Sensors, Devices
from django.conf import settings


if __name__ == '__main__':
    run_local()


class Command(BaseCommand):

    def handle(self, *args, **options):
        """
        Функция смотрит все файлы в директории с исполняемым файлом, фильтрует только xml
         и парсит их по определенному шаблону
        """
        mypath = Path(__file__).resolve().parent

        all_xml_files = [f for f in listdir(mypath) if isfile(join(mypath, f)) and f.endswith('.xml')]

        for file in all_xml_files:
            tree = ET.parse(mypath / str(file))
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
                )
