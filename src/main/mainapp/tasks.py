# -*- encoding: utf-8 -*-

from celery import shared_task


import logging
import os

import email
from email.header import decode_header
import base64
import xml.etree.ElementTree as ET
import imaplib

from django.core.files import File
from io import BytesIO
from core.models import Devices, Sensors
from authentication.models import CustomUser

from django.conf import settings

logger = logging.getLogger('smtp_server')


def get_session_mail():
    mail = settings.SESSION_MAIL['SESSION_MAIL']
    try:
        mail.select("INBOX")
    except imaplib.IMAP4.error:
        mail = imaplib.IMAP4_SSL(settings.EMAIL_SERVER)
        mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        settings.SESSION_MAIL.update({'SESSION_MAIL': mail})

    return mail


def parse_file(file):
    print('!!!___ DEF parse_file:')
    if file:
        try:
            tree = ET.parse(file)
            root_tree_1 = tree.getroot()
            complex_type = root_tree_1.find('complexType')
            device_name = complex_type.attrib['name']
            device = Devices.objects.get(name=device_name)
            if device:
                for element in complex_type.findall('element'):
                    print('element:', element)
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
                            device=device,
                        )
                return True
        except Exception as exc:
            logger.error(f'PARSE XML: {exc}')


@shared_task(name="start_smtp_server")
def start_smtp_server():
    """
    Функция провеверяет входящую почту и при наличии вложения парсит их
    """
    try:
        mail = get_session_mail()
        mail.select("INBOX")
        unseen = mail.search(None, "UNSEEN")
        if unseen:
            status, messages = unseen
            if messages:
                parse_str_message = str(messages[0])
                parse_str_message = parse_str_message.replace("b", "")
                parse_str_message = parse_str_message.replace("'", "")
                list_messages = parse_str_message.split(' ')
                print('smtp_server: list_messages:', list_messages)

                for message in list_messages:
                    if message:
                        _, msg = mail.fetch(message, '(RFC822)')

                        msg = email.message_from_bytes(msg[0][1])
                        letter_from = msg["Return-path"]

                        if letter_from[0] == '<' and letter_from[-1:] == '>':
                            letter_from = letter_from[1: -1]

                        print('letter_from:', letter_from)

                        filter_custom_user = CustomUser.objects.filter(email_user=letter_from)

                        if filter_custom_user:
                            for part in msg.walk():
                                if part.get_content_disposition() == 'attachment':
                                    get_filename = decode_header(part.get_filename())[0][0].decode()
                                    filename, file_extension = os.path.splitext(str(get_filename))
                                    if file_extension == '.xml':
                                        file = File.open(BytesIO(base64.b64decode(part.get_payload())))
                                        if file:
                                            print('file:', file, type(file))
                                            print('parse_file:', parse_file(file))
                                            file.close()
                        else:
                            print('smtp_server: Email пользователя не найден')
    except Exception as exc:
        logger.error(f'SMTP: {exc}')
