import React, {useState, Fragment, useEffect} from 'react';

//import { useHistory } from 'react-router-dom';
import axiosInstance from 'axios';

import { Modal } from '@consta/uikit/Modal';
import { TextField  } from '@consta/uikit/TextField';
import { Text  } from '@consta/uikit/Text';
import { Button } from '@consta/uikit/Button';
import { Grid, GridItem  } from '@consta/uikit/Grid';

import {Header, HeaderModule, HeaderLogin, HeaderLogo, HeaderMenu, HeaderButton, HeaderSearchBar} from '@consta/uikit/Header';
import {IconDiamond} from '@consta/uikit/IconDiamond';
//import {IconChat} from '@consta/uikit/IconChat';
import {IconRing} from '@consta/uikit/IconRing';
import logotype from './logo.png';

export const Navbar = (props) => {

//        const history = useHistory();
        const initialFormData = Object.freeze({ username: '', password: '', });
        const [formData, updateFormData] = useState(initialFormData);
        const [ErrorPass, setErrorPass] = useState(false)
        const [isModalOpen, setIsModalOpen] = React.useState(false);
        const [logged, setLogged] = useState(props.state)

        const Items = props.items

// Функция обновления формы ввода Логина и пароля. Запускается при изменении полей формы Логин.
        const handleChange = (event) => {
              updateFormData({...formData, [event.name]: event.value});
              setErrorPass(false);
        };

        const handleOnClickIcon = (event) => {
              event.preventDefault()
              window.location.assign('/messenger')
        };

        const divStyle = {
            marginLeft: '10px',
            marginTop: '5px',
            marginBottom: '5px',
        };

        const styleLogo = {
            marginTop: '5px',
        }

    useEffect(() => {
        //console.log(logged)
        if(logged.logged_in!==true) {setIsModalOpen(true)}
	}, [])


    return (
    <div>
        <Header class='Header' leftSide={
                                        <>
                                        <HeaderModule indent='l' rightSide=''>
                                            <HeaderLogo className="HeaderLogo" indent="s">
                                                <img src={logotype} alt='logo' style={styleLogo}/>
                                            </HeaderLogo>
                                        </HeaderModule>
                                        <HeaderModule indent='l' rightSide=''>
                                            <HeaderMenu
                                                className="HeaderMenu menuStyle"
                                                indent="l"
                                                items={Items}
                                            />
                                        </HeaderModule>
                                        </>
                                      }
                                rightSide = {
                                            <>
                                            <HeaderModule leftSide=''>
                                                <HeaderButton indent='m' form = 'brick' view="clear" className="menuStyle" label={logged.logged_in ? logged.role : ""} />
                                            </HeaderModule>
                                            <HeaderModule leftSide=''>
                                                {(logged.logged_in===true) && (<HeaderButton indent='m' iconLeft={IconRing} onClick = {handleOnClickIcon} />)}
                                            </HeaderModule>
                                            <HeaderModule leftSide=''>
                                                <HeaderLogin
                                                    isMinified = {false}
                                                    isLogged = {logged.logged_in}
                                                    personName = {logged.logged_in ? logged.fullusername : ""}
                                                    personInfo = {logged.person_info}
                                                    personStatus = {logged.person_status}
                                                    onClick = { (): void => setIsModalOpen(true) }
                                                    indent='m' />
                                            </HeaderModule>
                                            </>
                                            }
        />
        <Modal
            className='ModalWindow'
            isOpen={isModalOpen}
            hasOverlay= {true}
            onOverlayClick= {(): void => setIsModalOpen(false)}
        >
            <Text as="div" style={divStyle} size="xl" view="brand" className='ModalWindowTitle' display='block'> Вход в систему </Text>
            <div className='ModalWindowAction'>
                <form noValidate>
                   <Text as="div" style={divStyle} view="primary" size="l" weight="bold" lineHeight="l" align="left"> Имя пользователя: </Text>
                   <TextField style={divStyle} id="username" name="username" value = {formData.username} onChange={handleChange} />
                   <Text as="div" style={divStyle} view="primary" size="l" weight="bold" lineHeight="l" align="left"> Пароль: </Text>
                   <TextField style={divStyle} id="password"  name="password" type="password" value = {formData.password} onChange={handleChange} />
                   {ErrorPass && <Text as="div" style={divStyle} view="primary" size="xl" weight="bold" lineHeight="l" align="left"> Некорректный логин или пароль </Text> }
                   <div style={divStyle}>
                       <Button style={divStyle} label = 'Войти' form = 'default' size='l' view='primary' onClick=  {e => props.handleLogin(e, {username : formData.username, password: formData.password}, {setErrorPass: setErrorPass, setIsModalOpen: setIsModalOpen}, {action : true} )} />
                       <Button style={divStyle} label = 'Отмена' form = 'default' size='l' view='primary' onClick= {e => props.handleLogin(e, {username : formData.username, password: formData.password}, {setErrorPass: setErrorPass, setIsModalOpen: setIsModalOpen}, {action : false} )} />
                   </div>
                </form>
            </div>
      </Modal>
      </div>
    )
}
