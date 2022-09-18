import React, { useState } from 'react';
import { Modal } from '@consta/uikit/Modal';
import { Text  } from '@consta/uikit/Text';
import { Button  } from '@consta/uikit/Button';
import { IconSettings  } from '@consta/uikit/IconSettings';


export function Login(props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div>
     <Button
        label= {props.label}
        width = 'full'
        form = 'default'
        size='L'
        view='clear'
        iconLeft={IconSettings}
        iconSize="m"
        onClick={():void => setIsModalOpen(true)}
     />
      <Modal
        className='ModalWindow'
        isOpen={isModalOpen}
        hasOverlay
        onOverlayClick={(): void => setIsModalOpen(false)}
      >
        <Text as="p" size="s" view="secondary" className='ModalWindowTitle'>
          Заголовок модалки
        </Text>
        <Text as="p" size="m" view="primary" className='ModalWindowBody'>
          Описание в теле модалки. Здесь может находиться какая-то информация. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        </Text>
        <div className='ModalWindowAction'>
          <Button
            size="m"
            view="primary"
            label="Закрыть"
            width="default"
            iconLeft={IconSettings}
            onClick={(): void => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ModalWindow;