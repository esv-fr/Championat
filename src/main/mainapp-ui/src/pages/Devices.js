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
import { Badge, BadgePropStatus } from '@consta/uikit/Badge';

import { Modal } from '@consta/uikit/Modal';

import '../css/main_css.css';

type Item = string;
type ItemBadge = {
  text: string;
  badgeStatus: BadgePropStatus;
  badgeCount: number;
};


export const Devices = (props) => {

    const [contentAction, setContentAction] = useState([]);
    const [contentRepair, setContentRepair] = useState([]);
    const [contentDel, setContentDel] = useState([]);
    const [contentAlarm, setContentAlarm] = useState([]);
    const [contentPlan, setContentPlan] = useState([]);
    const [ready, setReady] = useState(false)
    const [readyEx, setReadyEx] = useState(false)

    const [isAddDeviceModalOpen, setAddDeviceModalOpen] = useState(false)
    const [isUpdDeviceModalOpen, setUpdDeviceModalOpen] = useState(false)
    const [isMapDeviceModalOpen, setMapDeviceModalOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams();

    const username = props.username
    const role = props.role

    const itemsBadgeCustomer = [{text: 'Планируется', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'В работе', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'В ремонте', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'Списано', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'Авария', badgeStatus: 'system', badgeCount: 0,},
                               ]
    const itemsBadgeExecutor = [{text: 'В работе', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'В ремонте', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'Списано', badgeStatus: 'system', badgeCount: 0,},
                                {text: 'Авария', badgeStatus: 'system', badgeCount: 0,},
                               ]
    const [itemsBadge, setItemsBadge] = useState(((role==='Исполнитель')?itemsBadgeExecutor:itemsBadgeCustomer))

    const [value, setValue] = useState((role==='Исполнитель')?{text: 'В работе', badgeStatus: 'system', badgeCount: 0,}:{text: 'Планируется', badgeStatus: 'system', badgeCount: 0,});
    //const id_contract = useParams()

    const columnsDevices = [
      { title: 'Наименование оборудования', accessor: 'name', align: 'center', sortable: true, },
      { title: 'Адрес площадки', accessor: 'address', align: 'center', sortable: true, },
      { title: 'Договор', accessor: 'contract_name', align: 'center', sortable: true, },
      { title: 'Подрядчик', accessor: 'executor_name', align: 'center',},
      { title: 'Заказчик', accessor: 'customer_name', align: 'center',},
    ];

    const handleMoveToMonitoring = (event) => {
        window.location.assign('/monitoring?id='+valueDevicePK);
    }

    const handleMoveToChat = (event) => {
        window.location.assign('/messenger?id='+valueContractPK);
    }

    const handleMoveToPlan = (event) => {
        window.location.assign('/plan?id='+valueDevicePK);
    }

    const itemsStatus = [{'id': 1, 'label': 'Планируется'}, {'id': 2, 'label': 'В работе'}, {'id': 3, 'label': 'В ремонте'}, {'id': 4, 'label': 'Списано'}, {'id': 5, 'label': 'Авария'}]

    const [itemsContract, setItemsContract] = useState([])

    const [valueContract, setValueContract] = useState(null);
    const [valueStatus, setValueStatus] = useState(itemsStatus[0]);
    const [valueAddressDevice, setValueAddressDevice] = useState(null);
    const [valueDevice, setValueDevice] = useState(null);
    const [valueLatitude, setValueLatitude] = useState(null);
    const [valueLongitude, setValueLongitude] = useState(null);
    const [valueDevicePK, setValueDevicePK] = useState(null)
    const [valueContractPK, setValueContractPK] = useState(null)

    const handleUpdateActivate = (id, event) => {
        console.log('Value:', value)
         if(value.text === 'Планируется'){
            contentPlan.map( (i) => {
                //console.log('Id: ', i.id, ' pk: ', id)
                if(i.id===id) {
                    setValueDevicePK(id)
                    setValueContractPK(i.contract_id)
                    setValueDevice(i.name)
                    setValueAddressDevice(i.address)
                    setValueLatitude(i.latitude)
                    setValueLongitude(i.longitude)
                    //console.log(i)
                    itemsStatus.map(y => {
                        console.log(y)
                        if(y.label===i.status) {
                            console.log('==', y)
                            setValueStatus(y)
                        }
                    })
                    itemsContract.map(y => {
                        if(y.label===i.contract_name) {
                            setValueContract(y)
                        }
                    })
                }
            })
        }
        if (value.text === 'В работе') {
            contentAction.map( (i) => {
                if(i.id===id) {
                    setValueDevicePK(id)
                    setValueDevice(i.name)
                    setValueContractPK(i.contract_id)
                    setValueAddressDevice(i.address)
                    setValueLatitude(i.latitude)
                    setValueLongitude(i.longitude)
                    //console.log(i)
                    itemsStatus.map(y => {
                        console.log(y)
                        if(y.label===i.status) {
                            setValueStatus(y)
                        }
                    })
                    itemsContract.map(y => {
                        if(y.label===i.contract_name) {
                            console.log('==', y)
                            setValueContract(y)
                        }
                    })
                }
            })
        }

        if (value.text === 'В ремонте') {
            contentRepair.map( (i) => {
                if(i.id===id) {
                    setValueDevicePK(id)
                    setValueDevice(i.name)
                    setValueContractPK(i.contract_id)
                    setValueAddressDevice(i.address)
                    setValueLatitude(i.latitude)
                    setValueLongitude(i.longitude)
                    itemsStatus.map(y => {
                        if(y.label===i.status) {
                            setValueStatus(y)
                        }
                    })
                    itemsContract.map(y => {
                        if(y.label===i.contract_name) {
                            setValueContract(y)
                        }
                    })
                }
            })
        }

        if (value.text === 'Списано') {
            contentDel.map( (i) => {
                if(i.id===id) {
                    setValueDevicePK(id)
                    setValueDevice(i.name)
                    setValueContractPK(i.contract_id)
                    setValueAddressDevice(i.address)
                    setValueLatitude(i.latitude)
                    setValueLongitude(i.longitude)
                    itemsStatus.map(y => {
                        if(y.label===i.status) {
                            setValueStatus(y)
                        }
                    })
                    itemsContract.map(y => {
                        if(y.label===i.contract_name) {
                            setValueContract(y)
                        }
                    })
                }
            })
        }
        if (value.text === 'Авария') {
            contentAlarm.map( (i) => {
                if(i.id===id) {
                    setValueDevicePK(id)
                    setValueDevice(i.name)
                    setValueContractPK(i.contract_id)
                    setValueAddressDevice(i.address)
                    setValueLatitude(i.latitude)
                    setValueLongitude(i.longitude)
                    itemsStatus.map(y => {
                        if(y.label===i.status) {
                            setValueStatus(y)
                        }
                    })
                    itemsContract.map(y => {
                        if(y.label===i.contract_name) {
                            setValueContract(y)
                        }
                    })
                }
            })
        }
        setUpdDeviceModalOpen(true)
    }

    const onChangeSelectContract = (event) => {
        setValueContract(event)
    }

    const onChangeSelectStatus = (event) => {
        setValueStatus(event)
    }

    const handleChangeDevice = (event) => {
        setValueDevice(event.value)
    }

    const handleChangeAddress = (event) => {
        setValueAddressDevice(event.value)
    }

    const handleChangeLatitude = (event) => {
        setValueLatitude(event.value)
    }

    const handleChangeLongitude = (event) => {
        setValueLongitude(event.value)
    }


    const handleAddDevice = (event) => {
        let addDeviceData = {
            'name': valueDevice,
            'address': valueAddressDevice,
            'status': valueStatus.label,
            'username': username,
            'latitude': valueLatitude,
            'longitude': valueLongitude,
            'contractName': valueContract
        }
        console.log('addDevice: ', addDeviceData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/adddevices/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: addDeviceData,
                    }).then(response => {
                        setAddDeviceModalOpen(false)
                        window.location.reload();
                })
                .catch(error => {
                    console.log('Add Device error: ' + error)
                    setAddDeviceModalOpen(false)
		        })
    }


    const handleUpdDevice = (event) => {
        let updDeviceData = {
            'pk': valueDevicePK,
            'name': valueDevice,
            'address': valueAddressDevice,
            'status': valueStatus.label,
            'contractName': valueContract,
            'latitude': valueLatitude,
            'longitude': valueLongitude,
            'username': username
        }
        console.log('addDevice: ', updDeviceData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/upddevices/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: updDeviceData,
                    }).then(response => {
                        setUpdDeviceModalOpen(false)
                        window.location.reload();
                })
                .catch(error => {
                    console.log('Update Device error: ' + error)
                    setUpdDeviceModalOpen(false)
		        })

    }


    const handleOverlayClick = (event) => {
        setAddDeviceModalOpen(false)
    }

    const handleOverlayClickUpd = (event) => {
        setUpdDeviceModalOpen(false)
    }


    const handleActivateClickMap = (event) => {
        setMapDeviceModalOpen(true)
    }


    const handleOverlayClickMap = (event) => {
        setMapDeviceModalOpen(false)
    }

    useEffect(()=>{
                    let url_devices
                    let id_contract = searchParams.get("id")
                    if(id_contract===undefined) {
                        url_devices = window.location.origin+'/api/devices'
                    }
                    else{
                        url_devices = window.location.origin+'/api/devices?id='+id_contract
                    }
                    axios({
                        method: "GET",
                            //url: window.location.origin+'/api/devices/',
                            url: url_devices,
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                }
                    }).then(response => {

                    let tmp1 = []
                    let tmp2 = []
                    let tmp3 = []
                    let tmp4 = []
                    let tmp5 = []
                    //console.log(response.data)
                    response.data.map( i => {
                        i['id'] = i['pk']
                        if(i.status==='В работе') {
                            tmp1.push(i)
                        }
                        else {
                            if(i.status==='Планируется') { tmp2.push(i) }
                            else { if(i.status==='В ремонте') { tmp3.push(i) }
                                   else {
                                          if(i.status==='Списано') { tmp4.push(i) }
                                          else { tmp5.push(i) }
                                   }
                            }
                        }
                        } )


                    if(role!=='Исполнитель') {
                        setItemsBadge([{text: 'Планируется', badgeStatus: 'system', badgeCount: tmp2.length,},
                                       {text: 'В работе', badgeStatus: 'system', badgeCount: tmp1.length,},
                                       {text: 'В ремонте', badgeStatus: 'system', badgeCount: tmp3.length,},
                                       {text: 'Списано', badgeStatus: 'system', badgeCount: tmp4.length,},
                                       {text: 'Авария', badgeStatus: (tmp5.length>0)?'error':'system', badgeCount: tmp5.length,},
                                      ])
                    }
                    else {
                        setItemsBadge([{text: 'В работе', badgeStatus: 'system', badgeCount: tmp1.length,},
                                       {text: 'В ремонте', badgeStatus: 'system', badgeCount: tmp3.length,},
                                       {text: 'Списано', badgeStatus: 'system', badgeCount: tmp4.length,},
                                       {text: 'Авария', badgeStatus: (tmp5.length>0)?'error':'system', badgeCount: tmp5.length,},
                                      ])
                    }

                    setContentAction(tmp1)
                    setContentPlan(tmp2)
                    setContentRepair(tmp3)
                    setContentDel(tmp4)
                    setContentAlarm(tmp5)
                    setReady(true)
                })
                .catch(error => {
                    console.log('Devices error: ' + error)
                    setReady(false)
		        })

                // Executor list
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
                        //console.log('ex: ', i, '  ', index)
                        tmpContract.push({'id': index, 'label': i.name})
                    })
                    //console.log('Total: ', tmpExecutor)
                    setItemsContract(tmpContract)
                    setReadyEx(true)
                })
                .catch(error => {
                    console.log('Contract error: ' + error)
                    setReadyEx(false)
		        })
            }, [])

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
                            > Оборудование </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />
                    <GridItem col="12" />
                    <GridItem col="1" />
                    <GridItem col="10">
                        <Tabs
                            value={value}
                            onChange={({ value }) => setValue(value)}
                            items={itemsBadge}
                            getLabel={(items) => items.text}
                            view ="bordered"
                            size="m"
                            className = "tabstyle"
                            renderItem={({ item, onChange, checked }) => (
                              <button type="button" onClick={onChange} className={cnTabsTab({ checked })}>
                                {item.text}
                                <Badge
                                  status={item.badgeStatus}
                                  label={item.badgeCount.toString()}
                                  size="m"
                                  style={{ marginLeft: 'var(--space-s)' }}
                                />
                              </button>
                            )}
                        />
                        </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12"/>

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card style={styleCard}>
                            { (value.text === 'Планируется') && (ready===true) && (role!=='Исполнитель') && (
                                <>
                                    <Table columns={columnsDevices} rows={contentPlan} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) } />
                                    <Button label = 'Добавить' id = '' form = 'brick' size='m' view='primary' onClick = { (event) => setAddDeviceModalOpen(true) } />
                                </>
                            ) }
                            { (value.text === 'В работе') && (ready===true) && (
                                    <Table columns={columnsDevices} rows={contentAction} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }/>
                            ) }
                            { (value.text === 'В ремонте') && (ready===true) && (
                                    <Table columns={columnsDevices} rows={contentRepair} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }/>
                            ) }
                            { (value.text === 'Списано') && (ready===true) && (
                                    <Table columns={columnsDevices} rows={contentDel} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }/>
                            ) }
                            { (value.text === 'Авария') && (ready===true) && (
                                    <Table columns={columnsDevices} rows={contentAlarm} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e) }/>
                            ) }
                        </Card>
                    </GridItem>
                    <GridItem col="1" />
                </Grid>

            <Modal
                    className='ModalWindow'
                    isOpen={isAddDeviceModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClick()}
                    onEsc = {(): void => handleOverlayClick()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                Добавить оборудование
                            </Text>
                            <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                <TextField id='deviceName' width = 'full' form = 'brick' name = "deviceName" value = {valueDevice} type = "text"
                                           label="Наименование оборудования:" size="m" placeholder="" onChange = { handleChangeDevice }
                                           className = "contractModalTextField"/>
                                <TextField id='deviceText' width = 'full' form = 'brick' name = "deviceText" value = {valueAddressDevice} type = "text"
                                           label="Адрес площадки:" size="m" placeholder="" onChange = { handleChangeAddress }
                                           className = "contractModalTextField" />
                                <Grid cols="7">
                                    <GridItem col="3">
                                        <TextField id='latitude' width = 'full' form = 'brick' name = "latitude" value = {valueLatitude} type = "text"
                                                   label="Широта:" size="m" placeholder="" onChange = { handleChangeLatitude }
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                    <GridItem col="1"/>
                                    <GridItem col="3">
                                        <TextField id='longitude' width = 'full' form = 'brick' name = "longitude" value = {valueLongitude} type = "text"
                                                   label="Долгота:" size="m" placeholder="" onChange = { handleChangeLongitude }
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                </Grid>
                                <Select label="Статус оборудования:" items = {itemsStatus} value = {valueStatus} id = "statusDevice" width = 'full'
                                                                view="primary" labelPosition="left" name = "statusDevice" type = "text"
                                                                size="l" onChange = {({value}) => onChangeSelectStatus(value)}
                                                                className = "contractModalTextField" />
                                    { (readyEx===true) && (
                                        <Select label="Контракт:" items = {itemsContract} value = {valueContract} id = "deviceContract" width = 'full'
                                                                    view="primary" labelPosition="left" name = "deviceContract" type = "text"
                                                                    size="l" onChange = {({value}) => onChangeSelectContract(value)}
                                                                    className = "contractModalTextField" />
                                      )
                                    }
                            </Card>

                            <Button label = 'Добавить' form = 'default' size='m' view='primary' onClick = {event => handleAddDevice(event)}
                                                        className = "contractModalTextField" />
                            <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClick()}
                                                        className = "contractModalTextField" />
                        </Card>
                    </div>
            </Modal>

            <Modal
                    className='ModalWindow'
                    isOpen={isUpdDeviceModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickUpd()}
                    onEsc = {(): void => handleOverlayClickUpd()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                { (role!=='Исполнитель')?'Изменить данные оборудования':'Просмотр данных оборудования' }
                            </Text>

                            { (role!=='Исполнитель' ) && (readyEx===true) && (
                            <>
                            <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                <TextField id='deviceName' width = 'full' form = 'brick' name = "deviceName" value = {valueDevice} type = "text"
                                           label="Наименование оборудования:" size="m" placeholder="" onChange = { handleChangeDevice }
                                           className = "contractModalTextField"/>
                                <TextField id='deviceText' width = 'full' form = 'brick' name = "deviceText" value = {valueAddressDevice} type = "text"
                                           label="Адрес площадки:" size="m" placeholder="" onChange = { handleChangeAddress }
                                           className = "contractModalTextField" />
                                <Grid cols="7">
                                    <GridItem col="3">
                                        <TextField id='latitude' width = 'full' form = 'brick' name = "latitude" value = {valueLatitude} type = "text"
                                                   label="Широта:" size="m" placeholder="" onChange = { handleChangeLatitude }
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                    <GridItem col="1"/>
                                    <GridItem col="3">
                                        <TextField id='longitude' width = 'full' form = 'brick' name = "longitude" value = {valueLongitude} type = "text"
                                                   label="Долгота:" size="m" placeholder="" onChange = { handleChangeLongitude }
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                </Grid>
                                <Select label="Статус оборудования:" items = {itemsStatus} value = {valueStatus} id = "statusDevice" width = 'full'
                                                            view="primary" labelPosition="left" name = "statusDevice" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectStatus(value)}
                                                            className = "contractModalTextField" />
                                <Select label="Контракт:" items = {itemsContract} value = {valueContract} id = "deviceContract" width = 'full'
                                                            view="primary" labelPosition="left" name = "deviceContract" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectContract(value)}
                                                            className = "contractModalTextField" />
                            </Card>

                                <Button label = 'Обновить' form = 'default' size='m' view='primary' onClick = {event => handleUpdDevice(event)}
                                                            className = "contractModalTextField" />
                                <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClickUpd()}
                                                            className = "contractModalTextField" />
                            </>
                            )}


                            { (role==='Исполнитель' ) && (
                            <>
                            <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                <TextField id='deviceName' width = 'full' form = 'brick' name = "deviceName" value = {valueDevice} type = "text"
                                           label="Наименование оборудования:" size="m" placeholder="" disabled
                                           className = "contractModalTextField"/>
                                <TextField id='deviceText' width = 'full' form = 'brick' name = "deviceText" value = {valueAddressDevice} type = "text"
                                           label="Адрес площадки:" size="m" placeholder="" disabled
                                           className = "contractModalTextField" />
                                <Grid cols="7">
                                    <GridItem col="3">
                                        <TextField id='latitude' width = 'full' form = 'brick' name = "latitude" value = {valueLatitude} type = "text"
                                                   label="Широта:" size="m" placeholder="" disabled
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                    <GridItem col="1"/>
                                    <GridItem col="3">
                                        <TextField id='longitude' width = 'full' form = 'brick' name = "longitude" value = {valueLongitude} type = "text"
                                                   label="Долгота:" size="m" placeholder="" disabled
                                                   className = "contractModalTextField" />
                                    </GridItem>
                                </Grid>

                                <TextField id='statusDevice' width = 'full' form = 'brick' name = "statusDevice" value = {valueStatus.label} type = "text"
                                           label="Статус оборудования:" size="m" placeholder="" className = "contractModalTextField" disabled />
                                <TextField id='deviceContract' width = 'full' form = 'brick' name = "valueContract" value = {(valueContract!==null)?valueContract.label:null} type = "text"
                                           label="Контракт:" size="m" placeholder="" className = "contractModalTextField" disabled />
                            </Card>
                            </>
                            )}

                            <div>
                                <Button label = 'Телеметрия' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToMonitoring(event)}
                                                            className = "contractModalTextField" />
                                <Button label = 'Планы работ' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToPlan(event)}
                                                                                        className = "contractModalTextField" />
                                <Button label = 'На карте' form = 'default' size='m' view='ghost' onClick = {event => handleActivateClickMap()}
                                                                                        className = "contractModalTextField" />
                                <Button label = 'Войти в Чат' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToChat(event)}
                                                                    className = "contractModalTextField" />

                            </div>
                        </Card>
                    </div>
            </Modal>

            <Modal
                    className='ModalWindow'
                    isOpen={isMapDeviceModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickMap()}
                    onEsc = {(): void => handleOverlayClickMap()}
            >
                    <div>
                        <Card>
                               <img className="mapStyle" src={"https://static-maps.yandex.ru/1.x/?ll="+valueLatitude+","+valueLongitude+"&z=8&l=map&size=450,450&pt="+valueLatitude+","+valueLongitude}
                                />
                        </Card>
                    </div>
            </Modal>


            </Fragment>
    )
}
