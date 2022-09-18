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
import { Checkbox } from '@consta/uikit/Checkbox';
import { Modal } from '@consta/uikit/Modal';

import '../css/main_css.css';

export const PlanActions = (props) => {

    const [content, setContent] = useState([]);
    const [itemsDevice, setItemsDevice] = useState([])
    const [ready, setReady] = useState(false)
    const [readyEx, setReadyEx] = useState(false)
    const [readyChoice, setReadyChoice] = useState(false)
    const [planUpdate, setPlanUpdate] = useState(false)

    const [valueStatusPlan, setValueStatusPlan] = useState(null)
    const [valueCheckPlan, setValueCheckPlan] = useState(null)
    const [valueTypePlan, setValueTypePlan] = useState(null)
    const [valueTypeAction, setValueTypeAction] = useState(null)
    const [valueTextPlan, setValueTextPlan] = useState(null)
    const [valueDatePlan, setValueDatePlan] = useState(null);

    const [readyUpd, setReadyUpd] = useState(false);

    const [isSensorModalOpen, setSensorModalOpen] = useState(false)

    const [isAddPlanModalOpen, setAddPlanModalOpen] = useState(false)
    const [isUpdPlanModalOpen, setUpdPlanModalOpen] = useState(false)

    const [valueDevice, setValueDevice] = useState(null)

    const itemsTypePlan = [{'id': 1, 'label': 'Черновик'}, {'id': 2, 'label': 'Активен'}]
    const itemsTypeAction = [{'id': 1, 'label': 'Ремонт'}, {'id': 2, 'label': 'Плановая'}]
    const itemsStatusPlan = [{'id': 1, 'label': 'План'}, {'id': 2, 'label': 'В работе'}, {'id': 3, 'label': 'Выполнено'}]
    const itemsCheckPlan = [{'id': 1, 'label': 'Не принято'}, {'id': 2, 'label': 'Принято'}]

    const username = props.username
    const role = props.role

    const [searchParams, setSearchParams] = useSearchParams();


    const onChangeSelectDevice = (event) => {

        if(planUpdate===false) {
            setPlanUpdate(true)
        }
        else {
            setPlanUpdate(false)
        }

        console.log('Test: ', event)
        setValueDevice(event)
        setReadyChoice(true)
    }

    const columnsDevices = [
      { title: 'Видимость плана', accessor: 'typePlan', align: 'center', sortable: true, },
      { title: 'Наименование работ', accessor: 'name', align: 'center', sortable: true, },
      { title: 'Дата проведения', accessor: 'date', align: 'center', sortable: true, },
      { title: 'Тип работ', accessor: 'type', align: 'center', sortable: true, },
      { title: 'Статус выполнения', accessor: 'statusExecutor', align: 'center',},
      { title: 'Результат проверки Заказчиком', accessor: 'checkCustomer', align: 'center',},
    ];

    const [valuePlan, setValuePlan] = useState([]);
    const [valuePlanPK, setValuePlanPK] = useState(null)

    const handleUpdateActivate = (id, event) => {
        valuePlan.map( (i) => {
            if(i.id===id) {
                    setValuePlanPK(id)
                    setValueTextPlan(i.name)
                    setValueDatePlan(i.date)

                    itemsStatusPlan.map(y => {
                        if(y.label===i.statusExecutor) {
                            setValueStatusPlan(y)
                        }
                    })

                    itemsCheckPlan.map(y => {
                        if(y.label===i.checkCustomer) {
                            setValueCheckPlan(y)
                        }
                    })

                    itemsTypePlan.map(y => {
                        if(y.label===i.typePlan) {
                            setValueTypePlan(y)
                        }
                    })

                    itemsTypeAction.map(y => {
                        if(y.label===i.type) {
                            setValueTypeAction(y)
                        }
                    })

            }
        })
        setReadyUpd(true)
        setUpdPlanModalOpen(true)
    }

    const onChangeSelectStatusPlan = (event) => {
        setValueStatusPlan(event)
    }

    const onChangeSelectCheckPlan = (event) => {
        setValueCheckPlan(event)
    }

    const onChangeSelectTypePlan = (event) => {
        setValueTypePlan(event)
    }

    const onChangeSelectTypeAction = (event) => {
        setValueTypeAction(event)
    }

    const handleChangeTextPlan = (event) => {
        setValueTextPlan(event.value)
    }

    const handleChangeDatePlan = (event) => {
        setValueDatePlan(event.value)
    }


    const handleAddPlan = (event) => {
        let addPlanData = {
            'name': valueTextPlan,
            'date': valueDatePlan,
            'type': valueTypeAction.label,
            'typePlan': valueTypePlan.label,
            'statusExecutor': valueStatusPlan.label,
            'checkCustomer': valueCheckPlan.label,
            'device': valueDevice
        }
        //console.log('addPlan: ', addPlanData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/addplan/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: addPlanData,
                    }).then(response => {
                        setAddPlanModalOpen(false)
                        if(planUpdate===false) {
                            setPlanUpdate(true)
                        }
                        else {
                            setPlanUpdate(false)
                        }
                })
                .catch(error => {
                    console.log('Add Plan error: ' + error)
                    setAddPlanModalOpen(false)
		        })
    }


    const handleUpdPlan = (event) => {
        let updPlanData = {
            'pk': valuePlanPK,
            'name': valueTextPlan,
            'date': valueDatePlan,
            'statusExecutor': valueStatusPlan.label,
            'type': valueTypeAction.label,
            'typePlan': valueTypePlan.label,
            'checkCustomer': valueCheckPlan.label,
            'device': valueDevice
        }
        console.log('updPlan: ', updPlanData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/updplan/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: updPlanData,
                    }).then(response => {
                        setUpdPlanModalOpen(false)
                        if(planUpdate===false) {
                            setPlanUpdate(true)
                        }
                        else {
                            setPlanUpdate(false)
                        }
                })
                .catch(error => {
                    console.log('Update Plan error: ' + error)
                    setUpdPlanModalOpen(false)
		        })

    }


    const handleOverlayClick = (event) => {
        setAddPlanModalOpen(false)
    }


    const handleOverlayClickUpd = (event) => {
        setUpdPlanModalOpen(false)
    }


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
                        tmpDevice.push({'id': i.pk, 'label': i.name, 'address':i.address, 'executor_name':i.executor_name, 'customer_name': i.customer_name, 'contract_name': i.contract_name})
                    })

                    setItemsDevice(tmpDevice)
                    setReadyEx(true)
                })
                .catch(error => {
                    console.log('Get list device: ' + error)
                    setItemsDevice(null)
                    setReadyEx(false)
		        })
    }, [])

    useEffect(()=>{
        let id_device = searchParams.get("id")
        console.log(id_device)
        if(id_device!==undefined) {
            itemsDevice.map(i => {
                console.log(i)
                if((''+i.id)===id_device){
                    onChangeSelectDevice(i)
                }
            })
        }
    }, [readyEx])


    useEffect(()=>{
                    if(valueDevice!==null) {
                        axios({
                            method: "GET",
                                url: window.location.origin+'/api/plan?id='+valueDevice.id,
                                headers:
                                    {
                                        Authorization : 'JWT '+ localStorage.getItem('token'),
                                    }
                        }).then(response => {
                            let tmp = []

                            response.data.map( i => {
                                if(role!=='Исполнитель' || i.typePlan!=='Черновик'){
                                    i['id'] = i['pk']
                                    tmp.push(i)
                                }
                                } )
                            setValuePlan(tmp)
                            setReady(true)
                        })
                        .catch(error => {
                            setReady(false)
                            console.log('Plan error: ' + error)
                        })
                    }
    }, [planUpdate])


        const styleGrid = {
            width: '100%',
        }

        const styleCard = {
            padding: '5px',
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
                            > План работ </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Select label="Оборудование:" items = {itemsDevice} value = {valueDevice} id = "deviceList"
                                                            view="primary" labelPosition="left" name = "deviceList" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectDevice(value)}
                                                            placeholder="Выберите оборудование" className = "contractModalTextField" />
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="1" />
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Адрес: {valueDevice.address} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Договор: {valueDevice.contract_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Заказчик: {valueDevice.customer_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="2" style={styleGrid}>
                        { (readyChoice===true) && (
                            <Text view="secondary" size="l" lineHeight="l" align="left" className = "contractModalTextField" > Подрядчик: {valueDevice.executor_name} </Text>
                          )
                        }
                    </GridItem>
                    <GridItem col="3" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card style={styleCard}>
                            { (planUpdate===false) && (
                                <>
                                    <Table columns={columnsDevices} rows={valuePlan} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }
                                        emptyRowsPlaceholder={<Text> Выберите оборудование для получения данных</Text>} />
                                </>
                            ) }
                            { (planUpdate===true) && (
                                <>
                                    <Table columns={columnsDevices} rows={valuePlan} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }
                                        emptyRowsPlaceholder={<Text> Выберите оборудование для получения данных</Text>}/>
                                </>
                            ) }
                            { (readyChoice===true) && (role!=='Исполнитель') && (
                                   <Button label = 'Добавить' id = '' form = 'brick' size='m' view='primary' onClick = { (event) => setAddPlanModalOpen(true) } />
                            )}
                        </Card>
                    </GridItem>
                    <GridItem col="1" />
                </Grid>

            <Modal
                    className='ModalWindow'
                    isOpen={isAddPlanModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClick()}
                    onEsc = {(): void => handleOverlayClick()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                Добавить план работ
                            </Text>
                            <Select label="Видимость плана:" items = {itemsTypePlan} value = {valueTypePlan} id = "typePlan" width = 'full'
                                                        view="primary" labelPosition="left" name = "typePlan" type = "text"
                                                        size="l" onChange = {({value}) => onChangeSelectTypePlan(value)}
                                                        className = "contractModalTextField" />
                            <TextField id='planName' width = 'full' form = 'brick' name = "planName" value = {valueTextPlan} type = "textarea" rows="2"
                                       label="Наименование работ:" size="m" placeholder="" onChange = { handleChangeTextPlan }
                                       className = "contractModalTextField"/>
                            <TextField id='planDate' width = 'full' form = 'brick' name = "planDate" value = {valueDatePlan} type = "text"
                                       label="Дата проведения работ:" size="m" placeholder="" onChange = { handleChangeDatePlan }
                                       className = "contractModalTextField"/>
                            <Select label="Тип работ:" items = {itemsTypeAction} value = {valueTypeAction} id = "typeAction" width = 'full'
                                                        view="primary" labelPosition="left" name = "typeAction" type = "text"
                                                        size="l" onChange = {({value}) => onChangeSelectTypeAction(value)}
                                                        className = "contractModalTextField" />
                            <Select label="Выполнена Подрядчиком:" items = {itemsStatusPlan} value = {valueStatusPlan} id = "typePlan" width = 'full'
                                                        view="primary" labelPosition="left" name = "statusPlan" type = "text"
                                                        size="l" onChange = {({value}) => onChangeSelectStatusPlan(value)}
                                                        className = "contractModalTextField" />
                            <Select label="Принята Заказчиком:" items = {itemsCheckPlan} value = {valueCheckPlan} id = "checkPlan" width = 'full'
                                                        view="primary" labelPosition="left" name = "checkPlan" type = "text"
                                                        size="l" onChange = {({value}) => onChangeSelectCheckPlan(value)}
                                                        className = "contractModalTextField" />

                            <Button label = 'Добавить' form = 'default' size='m' view='primary' onClick = {event => handleAddPlan(event)}
                                                        className = "contractModalTextField" />
                            <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClick()}
                                                        className = "contractModalTextField" />
                        </Card>
                    </div>
            </Modal>

            <Modal
                    className='ModalWindow'
                    isOpen={isUpdPlanModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickUpd()}
                    onEsc = {(): void => handleOverlayClickUpd()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                { (role==='Исполнитель')?'План работ':'Изменить план работ'}
                            </Text>
                            {(role!=='Исполнитель') && (readyUpd===true) && (
                            <>
                                <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                    <Select label="Видимость плана:" items = {itemsTypePlan} value = {valueTypePlan} id = "typePlan" width = 'full'
                                               view="primary" labelPosition="left" name = "typePlan" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectTypePlan(value)} className = "contractModalTextField" />
                                    <TextField id='planName' width = 'full' form = 'brick' name = "planName" value = {valueTextPlan} type = "textarea" rows="2"
                                               label="Наименование работ:" size="m" placeholder="" onChange = { handleChangeTextPlan }
                                               className = "contractModalTextField"/>
                                    <TextField id='planDate' width = 'full' form = 'brick' name = "planDate" value = {valueDatePlan} type = "text"
                                               label="Дата проведения работ:" size="m" placeholder="" onChange = { handleChangeDatePlan }
                                               className = "contractModalTextField"/>
                                    <Select label="Тип работ:" items = {itemsTypeAction} value = {valueTypeAction} id = "typeAction" width = 'full'
                                               view="primary" labelPosition="left" name = "typeAction" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectTypeAction(value)} className = "contractModalTextField" />
                                    <TextField id='valueStatusPlan' width = 'full' form = 'brick' name = "planDate" value = {valueStatusPlan.label} type = "text"
                                               label="Статус выполнения (подрядчик):" size="m" placeholder="" className = "contractModalTextField" disabled/>
                                    <Select label="Приемка Заказчиком:" items = {itemsCheckPlan} value = {valueCheckPlan} id = "checkPlan" width = 'full'
                                               view="primary" labelPosition="left" name = "checkPlan" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectCheckPlan(value)} className = "contractModalTextField" />
                                </Card>
                                <Button label = 'Обновить' form = 'default' size='m' view='primary' onClick = {event => handleUpdPlan(event)}
                                           className = "contractModalTextField" />
                                <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClickUpd()}
                                           className = "contractModalTextField" />
                            </>
                            )}

                            {(role==='Исполнитель') && (readyUpd===true) && (
                            <>
                                <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                    <TextField id='planName' width = 'full' form = 'brick' name = "planName" value = {valueTextPlan} type = "textarea" rows="2"
                                           label="Наименование работ:" size="m" placeholder="" onChange = { handleChangeTextPlan }
                                           className = "contractModalTextField" disabled/>
                                    <TextField id='planDate' width = 'full' form = 'brick' name = "planDate" value = {valueDatePlan} type = "text"
                                           label="Дата проведения работ:" size="m" placeholder="" onChange = { handleChangeDatePlan }
                                           className = "contractModalTextField" disabled/>
                                    <TextField id='typeAction' width = 'full' form = 'brick' name = "typeAction" value = {valueTypeAction.label} type = "text"
                                           label="Тип работ:" size="m" placeholder="" disabled className = "contractModalTextField" />
                                    <Select label="Статус выполнения (подрядчик):" items = {itemsStatusPlan} value = {valueStatusPlan} id = "typePlan" width = 'full'
                                           view="primary" labelPosition="left" name = "statusPlan" type = "text"
                                           size="l" onChange = {({value}) => onChangeSelectStatusPlan(value)} className = "contractModalTextField" />
                                    <TextField id='checkPlan' width = 'full' form = 'brick' name = "checkPlan" value = {valueCheckPlan.label} type = "text"
                                           label="Приемка Заказчиком:" size="m" placeholder="" disabled className = "contractModalTextField" />
                                </Card>
                                <Button label = 'Обновить' form = 'default' size='m' view='primary' onClick = {event => handleUpdPlan(event)}
                                           className = "contractModalTextField" />
                                <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClickUpd()}
                                           className = "contractModalTextField" />
                            </>)}
                        </Card>
                    </div>
            </Modal>

        </Fragment>
    )
}
