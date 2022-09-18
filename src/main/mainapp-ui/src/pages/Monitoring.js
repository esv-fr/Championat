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
import { Line } from '@consta/charts/Line';
import { Radar } from '@consta/charts/Radar';

import { Modal } from '@consta/uikit/Modal';

import schema from './x033.jpg';

import '../css/main_css.css';


export const Monitoring = () => {

    const [content, setContent] = useState([]);
    const [itemsDevice, setItemsDevice] = useState([])
    const [itemsSensor, setItemsSensor] = useState([])
    const [ready, setReady] = useState(false)
    const [readyEx, setReadyEx] = useState(false)
    const [readyTypeSensor, setReadyTypeSensor] = useState(false)

    const [readyChoice, setReadyChoice] = useState(false)
    const [lineUpdate, setLineUpdate] = useState(false)
    const [valueDevice, setValueDevice] = useState(null);
    const [valueSensor, setValueSensor] = useState(null);

    const [isSensorModalOpen, setSensorModalOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();

    const itemsGraph = [{'id': 1, 'label': 'Линейный'}, {'id': 2, 'label': 'Радар'}];
    const [typeGraph, setTypeGraph] = useState(itemsGraph[0])

    const handleOverlayClickSensor = (event) => {
        setSensorModalOpen(false)
    }

    const onChangeSelectDevice = (event) => {

        if(lineUpdate===false) {
            setLineUpdate(true)
        }
        else {
            setLineUpdate(false)
        }
        console.log('Test: ', event)
        setValueDevice(event)
        setReadyChoice(true)
    }

    const onChangeSelectSensor = (event) => {

        if(lineUpdate===false) {
            setLineUpdate(true)
        }
        else {
            setLineUpdate(false)
        }
        setValueSensor(event)
    }

    const onChangeSelectTypeGraph = (event) => {
        console.log(event)
        if(lineUpdate===false) {
            setLineUpdate(true)
        }
        else {
            setLineUpdate(false)
        }
        setTypeGraph(event)
    }


    const [graphIn, setGraphIn] = useState(null)

    useEffect(()=>{
                axios({
                        method: "GET",
                            url: window.location.origin+'/api/devices/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                }
                }).then(response => {
                    console.log('Get list devices:', response.data)
                    let tmpDevice = []

                    response.data.map( (i,index) => {
                        tmpDevice.push({'id': i.pk, 'label': i.name, 'address':i.address, 'contract_name': i.contract_name, 'customer_name': i.customer_name, 'executor_name': i.executor_name})
                    })

                    setItemsDevice(tmpDevice)
                    setReadyEx(true)
                })
                .catch(error => {
                    console.log('Get list device: ' + error)
                    setItemsDevice(null)
                    setReadyEx(false)
		        })

                axios({
                        method: "GET",
                            url: window.location.origin+'/api/typesensors/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                }
                }).then(response => {
                    console.log('Get list sensors:', response.data)
                    let tmpSensors = []
                    tmpSensors.push({'id': 0, 'label': 'Все датчики', 'code': 'all'})
                    response.data.map( (i,index) => {
                        tmpSensors.push({'id': index+1, 'label': i.name, 'code': i.code})
                    })

                    setItemsSensor(tmpSensors)
                    setReadyTypeSensor(true)
                })
                .catch(error => {
                    console.log('Get list sensors: ' + error)
                    setItemsSensor(null)
                    setReadyTypeSensor(false)
		        })

    }, [])

    useEffect(()=>{
        let id_device = searchParams.get("id")
        if(id_device!==undefined) {
            itemsDevice.map(i => {
                if((''+i.id)===id_device){
                    onChangeSelectDevice(i)
                }
            })
        }
    }, [readyEx])


    useEffect(()=>{
                    if(valueDevice!==null && valueSensor!==null) {
                        axios({
                            method: "GET",
                                url: window.location.origin+'/api/monitoring?id='+valueDevice.id+'&code='+valueSensor.code,
                                headers:
                                    {
                                        Authorization : 'JWT '+ localStorage.getItem('token'),
                                    }
                        }).then(response => {
                            setGraphIn(response.data)
                            setReady(true)
                        })
                        .catch(error => {
                            setReady(false)
                            console.log('Monitoring error: ' + error)
                        })
                    }
            }, [lineUpdate])


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
                            > Мониторинг оборудования </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12" />

                    <GridItem col="1" />
                    <GridItem col="3" style={styleGrid} >
                        <Select label="Оборудование:" items = {itemsDevice} value = {valueDevice} id = "deviceList"
                                                            view="primary" labelPosition="left" name = "deviceList" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectDevice(value)}
                                                            placeholder="Выберите оборудование" className = "contractModalTextField" />
                    </GridItem>
                    <GridItem col="2" style={styleGrid} >
                    {(readyTypeSensor===true) && (valueDevice!==null) && (
                        <Select label="Датчик:" items = {itemsSensor} value = {valueSensor} id = "sensorList"
                                                            view="primary" labelPosition="left" name = "sensorList" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectSensor(value)}
                                                            placeholder="Выберите датчик" className = "contractModalTextField" />
                    )}
                    </GridItem>
                    <GridItem col="2" style={styleGrid} >
                    {(readyTypeSensor===true) && (valueDevice!==null) && (
                        <Select label="Вид:" items = {itemsGraph} value = {typeGraph} id = "typeList"
                                                            view="primary" labelPosition="left" name = "typeList" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectTypeGraph(value)}
                                                            placeholder="Выберите тип отчета" className = "contractModalTextField" />
                    )}
                    </GridItem>
                    <GridItem col="2" >
                    {(readyTypeSensor===true) && (valueDevice!==null) && (
                        <Button label = 'Схема установки' id = '' form = 'brick' size='m' view='ghost' onClick = { (event) => setSensorModalOpen(true) }
                            className = "monitoringButton"/>
                    )}
                    </GridItem>
                    <GridItem col="2" />

                    <GridItem col="1" />
                    <GridItem col="3" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="primary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Адрес: {valueDevice.address} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="3" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="primary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Договор: {valueDevice.contract_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="primary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Заказчик: {valueDevice.customer_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="primary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Подрядчик: {valueDevice.executor_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card className = "messengerLineCard">
                            {(lineUpdate===false) && (ready===true) && (valueSensor!==null) && (typeGraph.label==='Линейный') && (
                                <>
                                    <Line data={graphIn} xField='date' yField={'value'} seriesField="temp" slider={{ start: 0.1, end: 0.5 }} />
                                </>

                            )}
                            {(lineUpdate===false) && (ready===true) && (valueSensor!==null) && (typeGraph.label==='Радар') && (
                                <>
                                    <Radar data={graphIn} xField='date' yField={'value'} seriesField="temp" />
                                </>

                            )}

                            {(lineUpdate===true) && (ready===true) && (valueSensor!==null) && (typeGraph.label==='Линейный') && (
                                <>
                                    <Line data={graphIn} xField='date' yField={'value'} seriesField="temp" slider={{ start: 0.1, end: 0.5 }} />
                                </>
                            )}
                            {(lineUpdate===true) && (ready===true) && (valueSensor!==null) && (typeGraph.label==='Радар') && (
                                <>
                                    <Radar data={graphIn} xField='date' yField={'value'} seriesField="temp" />
                                </>

                            )}
                        </Card>
                    </GridItem>
                    <GridItem col="1" />
                </Grid>

            <Modal
                    className='ModalWindow'
                    isOpen={isSensorModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickSensor()}
            >
                    <div>
                        <Card>
                               <img className="mapStyle" src={schema}
                                />
                        </Card>
                    </div>
            </Modal>

            </Fragment>
    )
}
