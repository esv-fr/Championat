import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import { Helmet } from 'react-helmet'

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Grid, GridItem  } from '@consta/uikit/Grid';

import {Navbar} from './components/Navbar';
import {Footer} from './components/Footer';
import {Logout} from './components/logout';

import {Contracts} from './pages/Contracts';
import {Monitoring} from './pages/Monitoring';
import {Messenger} from './pages/Messenger';
import {Devices} from './pages/Devices';
import {Control} from './pages/Control';
import {About} from './pages/About';
import {NotFound} from './pages/NotFound';
import {PlanActions} from './pages/PlanActions';
import {Reports} from './pages/Reports';

function App() {

    const [state, setState] = useState({
			 logged_in : localStorage.getItem('token') ? true : false,
			 username  : localStorage.getItem('token') ? localStorage.getItem('currentUser'): '',
			 fullusername  : localStorage.getItem('token') ? localStorage.getItem('currentfullUser'): '',
			 displayed_form : '',
			 person_info : localStorage.getItem('token') ? localStorage.getItem('company'): '',
			 person_status : '',
			 role : localStorage.getItem('token') ? localStorage.getItem('role'): '',
			 })

    const menuNoAuth = [
                        //{ label : 'О системе', active : false, href : '/about'},
                     ];

    const menuAdminAuth = [
                        //{ label : 'О системе', active : false, href : '/about'},
                        { label : 'Настройка', active : false, href : '/control' },
                     ];

    const menuCustomerAuth = [
                         { label : 'Контракты', active : false, href : '/contracts' },
                         { label : 'Оборудование', active : false, href : '/devices' },
                         { label : 'Мониторинг', active : false, href : '/monitoring' },
                         { label : 'План работ', active : false, href : '/plan' },
                         { label : 'Отчеты', active : false, href : '/reports' },
                       ];

    const menuExecutorAuth = [
                         { label : 'Контракты', active : false, href : '/contracts' },
                         { label : 'Оборудование', active : false, href : '/devices' },
                         { label : 'Мониторинг', active : false, href : '/monitoring' },
                         { label : 'План работ', active : false, href : '/plan' },
                       ];
    const menuAnalystAuth = [
                         { label : 'Контракты', active : false, href : '/contracts' },
                         { label : 'Оборудование', active : false, href : '/devices' },
                         { label : 'Мониторинг', active : false, href : '/monitoring' },
                         { label : 'План работ', active : false, href : '/plan' },
                         { label : 'Отчеты', active : false, href : '/reports' },
                       ];
    const menuEngineerAuth = [
                         { label : 'Контракты', active : false, href : '/contracts' },
                         { label : 'Оборудование', active : false, href : '/devices' },
                         { label : 'Мониторинг', active : false, href : '/monitoring' },
                         { label : 'План работ', active : false, href : '/plan' },
                         { label : 'Отчеты', active : false, href : '/reports' },
                         { label : 'Загрузка', active : false, href : '/controlengineer' },
                       ];


    const [items, setItems] = useState(null)

    const handleLogin = (e, data, setModal, action) => {
		e.preventDefault();
		if (action.action===true){
		fetch(window.location.origin+'/api-auth/login/',
		{
                async : true,
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
            })
            .then(response => response.json())
            .then(json => {
                console.log('Response api auth: ', json)
                localStorage.setItem('token', json.token);
                localStorage.setItem('currentUser', json.username);
                localStorage.setItem('currentfullUser', json.fullusername);
                localStorage.setItem('company', json.company);
                localStorage.setItem('role', json.role);
                setState({...state,
                    'logged_in' : true,
                    'username' : json.username,
                    'fullusername': json.fullusername,
                    'person_info' : json.company,
                    'role': json.role,
                })
                setModal.setIsModalOpen(false)
                console.log('Token Login:', localStorage.getItem('token'))
                window.location.assign('/')
            })
            .catch(error => {
                console.log('Error handle Login: ' + error)
                localStorage.removeItem('token')
                localStorage.removeItem('currentUser')
                localStorage.removeItem('company')
                localStorage.removeItem('role')
                setState({...state,
                    'logged_in': false,
                    'username': '',
                    'fullusername': '',
                    'person_info': '',
                    'role': '',
                })
                setModal.setErrorPass(true)
                window.location.assign('/')
            })
        }else
        {
            setModal.setIsModalOpen(false)
        }
	}

    useEffect(() => {
       //Если пользователь ранее был авторизован, то проверяем его токен.
       if(state.logged_in){
            axios(window.location.origin+'/api-auth/current-user/', {
				method : 'GET',
				headers : {
					Authorization : 'jwt '+ localStorage.getItem('token'),
				}
			})
			.then(resp => {
				setState({...state,
				            'username' : resp.data.username,
				            'fullusername': resp.data.fullusername,
				            'person_info' : resp.data.company,
                            'role': resp.data.role,
				         });
                if (localStorage.getItem('role')==='Администратор') { setItems(menuAdminAuth) }
                else {
                        if (localStorage.getItem('role')==='Заказчик') { setItems(menuCustomerAuth) }
                        else {
                              if (localStorage.getItem('role')==='Исполнитель') { setItems(menuExecutorAuth) }
                              else {
                                    if (localStorage.getItem('role')==='Аналитик (Заказчик)') { setItems(menuAnalystAuth) }
                                    else {
                                          if (localStorage.getItem('role')==='Инженер (Заказчик)') { setItems(menuEngineerAuth) }
                                          else { setItems(menuNoAuth) }
                                    }
                              }
                        }
                     }
			}).catch(error => {
			            console.log('UseEffect: Logged_in is False !!!')
			            console.log(error)
			            localStorage.removeItem('token')
                        localStorage.removeItem('currentUser')
                        setState({...state,
                            'logged_in' : false,
                            'username' : '',
                            'fullusername' : '',
                            'person_info' : '',
                            'role': '',
			            });
			            setItems(menuNoAuth)
			})
	   }
	   else {
            setItems(menuNoAuth)
	   }
	}, [])

    return (
        <Theme preset={presetGpnDefault}>
            <Helmet title = "Динамика" />
            {
                (items!==null) && (
                    <Navbar
                        state = {state}
                        handleLogin = {handleLogin}
                        items = {items}
                    />
                )
            }
            <BrowserRouter>
                         <Routes>
                             {/* (state.logged_in ===true) && (<Route path ={'/'} element = { <Contracts/> } ) */}
                             {/* (state.logged_in === false) && (<Route path ={'/'} element = { <About/> } ) */}
                             {/*<Route exact path ='/' render = {() => state.logged_in ? (<Contracts username={state.username} role={state.role}/>) : (<About/>) } />*/}
                             <Route exact path ='/' element = { state.logged_in ? <Contracts username={state.username} role={state.role}/> : <About /> } />
                             <Route path='/contracts' element = {<Contracts username={state.username} role={state.role}/>} />
                             <Route path='/monitoring' element = {<Monitoring/>} />
                             <Route path="/devices:id_contract" element={<Devices role={state.role}/>} />
                             <Route path='/devices' element = {<Devices username={state.username} role={state.role}/>} />
                             <Route path='/plan' element = {<PlanActions username={state.username} role={state.role}/>} />
                             <Route path='/messenger' element = {<Messenger username={state.username} role={state.role}/>} />
                             <Route path="/messenger:id_contract" element={<Messenger username={state.username} role={state.role}/>} />
                             <Route path='/reports' element = {<Reports username={state.username} role={state.role}/>} />
                             <Route path='/control' element = {<Control/>} />
                             <Route path='/controlengineer' element = {<Control role={state.role} />} />
                             <Route path='/about' element = {<About/>} />
                             <Route path="*" element = {<NotFound/>} />
                        </Routes>
            </BrowserRouter>
            {
                (items!==null) && ( <Footer /> )
            }
        </Theme>
);
}

export default App;
