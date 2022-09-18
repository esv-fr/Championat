import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios';

import { useParams, useSearchParams } from 'react-router-dom';

import { Tabs, cnTabsTab  } from '@consta/uikit/Tabs';
import { Grid, GridItem  } from '@consta/uikit/Grid';
import { Button } from '@consta/uikit/Button';
import { Text  } from '@consta/uikit/Text';
import { IconSettings  } from '@consta/uikit/IconSettings';
import { Table } from '@consta/uikit/Table';
import { Card } from '@consta/uikit/Card';
import { Select } from '@consta/uikit/Select';
import { TextField  } from '@consta/uikit/TextField';

import '../css/main_css.css';

type Item = string;
const items: Item[] = ['На исполнении', 'В подготовке' ];
//const status = ['Согласование', 'Реализация', 'Приостановлено', 'Закрыто'];

export const Messenger = (props) => {

    const [value, setValue] = useState(items[0]);
    const [content, setContent] = useState([]);
    const [itemsContract, setItemsContract] = useState([])
    const [ready, setReady] = useState(false)
    const [readyEx, setReadyEx] = useState(false)
    const [readyChoice, setReadyChoice] = useState(false)
    const [textUpdate, setTextUpdate] = useState(false)
    const [valueContract, setValueContract] = useState(null);
    const [valueTextMessenger, setValueTextMessenger] = useState(null);
    const [valueExecutor, setValueExecutor] = useState(null)
    const [valueCustomer, setValueCustomer] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams();

    const onChangeSelectContract = (event) => {

        if(textUpdate===false) {
            setTextUpdate(true)
        }
        else {
              setTextUpdate(false)
        }

        setValueContract(event)
        setValueExecutor(event.executor_name)
        setValueCustomer(event.customer_name)
        setReadyChoice(true)
    }

    const username = props.username

    const handleChangeTextMessenger = (event) => {
        setValueTextMessenger(event.value)
    }

    const handleSendText = (event) => {
        let sendTextData = {
            'text': valueTextMessenger,
            'pk': valueContract.id,
            'username': username,
        }
        console.log('sendText: ', sendTextData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/sendtext/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: sendTextData,
                    }).then(response => {
                        //window.location.reload();
                        //console.log(textUpdate)
                        if(textUpdate===false) {
                            setTextUpdate(true)
                        }
                        else {
                            setTextUpdate(false)
                        }
                })
                .catch(error => {
                    console.log('Send Text error: ' + error)
		        })
    }

    useEffect(()=>{

                    axios({
                            method: "GET",
                                url: window.location.origin+'/api/contracts/',
                                headers:
                                    {
                                        Authorization : 'JWT '+ localStorage.getItem('token'),
                                    }
                    }).then(response => {
                        console.log('Contracts:', response.data)
                        let tmpContract = []

                        response.data.map( (i,index) => {
                            tmpContract.push({'id': i.pk, 'label': i.name, 'executor_name':i.executor_name, 'customer_name': i.customer_name})
                        })

                        setItemsContract(tmpContract)

                        let id_contract = searchParams.get("id")

                        if(id_contract!==undefined) {
                            tmpContract.map( (i) => {
                                if(i.id.toString()===id_contract.toString()){
                                    setValueContract(i)
                                    setValueExecutor(i.executor_name)
                                    setValueCustomer(i.customer_name)
                                    setReadyChoice(true)

                                    if(textUpdate===false) {
                                        setTextUpdate(true)
                                    }
                                    else {
                                          setTextUpdate(false)
                                    }
                                }
                            }
                            )
                        }

                        setReadyEx(true)
                    })
                    .catch(error => {
                        console.log('Contracts error: ' + error)
                        setReadyEx(false)
                    })

            }, [])


    useEffect(()=>{

                    if(valueContract!==null) {
                        axios({
                            method: "GET",
                                //url: window.location.origin+'/api/messenger/',
                                url: window.location.origin+'/api/messenger?id='+valueContract.id,
                                headers:
                                    {
                                        Authorization : 'JWT '+ localStorage.getItem('token'),
                                    }
                        }).then(response => {
                        setContent(response.data)
                        setReady(true)
                    })
                    .catch(error => {
                        setReady(false)
                        console.log('Messenger error: ' + error)
                    })
                    }
            }, [textUpdate])


        const styleGrid = {
            width: '100%',
        }

    return(
            <Fragment>
                <Grid
                    cols="12"
                    gap="xs"
                    xAlign='left'
                    breakpoints={{
                      xs: {
                        colgap: 'xs',
                      },
                      m: {
                        colgap: 'm',
                    },
                }}
                >
                    <GridItem col="12" row="3"/>
                    <GridItem col="1" />
                    <GridItem col="10">
                        <div>
                        <Text
                            view="brand"
                            size="2xl"
                            weight="bold"
                            lineHeight="l"
                            align="left"
                            > Обмен сообщениями </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12" />

                    <GridItem col="1" />
                    <GridItem col="3" style={styleGrid} >
                        <Select label="Контракт:" items = {itemsContract} value = {valueContract} id = "deviceContract"
                                                            view="primary" labelPosition="left" name = "deviceContract" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectContract(value)}
                                                            placeholder="Выберите контракт" className = "contractModalTextField" />
                    </GridItem>
                    <GridItem col="1" />
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Заказчик: {valueCustomer} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="1" />
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Подрядчик: {valueExecutor} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card className = "messengerTextCard">
                        {(textUpdate===false) && (
                            <>
                            {content.map( (i) => (
                                <Text view="secondary" size="m" lineHeight="l" align="left" > {i.timestamp} : {i.author_name} : {i.text} </Text>
                            ))}
                            </>
                        )}
                        {(textUpdate===true) && (
                            <>
                            {content.map( (i) => (
                                <Text view="secondary" size="m" lineHeight="l" align="left" > {i.timestamp} : {i.author_name} : {i.text} </Text>
                            ))}
                            </>
                        )}
                        </Card>
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card className="contractModalCard">
                            <Grid cols="12" gap="xs">
                                <GridItem col="5">
                                {(readyChoice===true) && (
                                    <TextField id='text' width = 'full' form = 'brick' name = "text" value = {valueTextMessenger} type = "textarea"
                                               cols="200" rows="3"
                                               size="m" placeholder="" onChange = { handleChangeTextMessenger } className = "contractModalTextField"/>
                                )
                                }
                                {(readyChoice===false) && (
                                    <TextField id='text' width = 'full' form = 'brick' name = "text" value = {valueTextMessenger} type = "textarea"
                                               cols="200" rows="3"
                                               size="m" placeholder="Выберите контракт" onChange = { handleChangeTextMessenger } className = "contractModalTextField" disabled/>
                                )
                                }
                                </GridItem>
                                <GridItem col="7">
                                {(readyChoice===true) && (
                                    <Button label = 'Отправить' id = '' form = 'brick' size='m' view='primary' className = "contractModalTextField"
                                            onClick = {event => handleSendText(event)} />
                                )
                                }
                                {(readyChoice===false) && (
                                    <Button label = 'Отправить' id = '' form = 'brick' size='m' view='primary' disabled className = "contractModalTextField"/>
                                )
                                }
                                </GridItem>
                            </Grid>
                        </Card>
                    </GridItem>
                    <GridItem col="1" />


                </Grid>
            </Fragment>
    )
}
