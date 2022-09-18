import React, {Fragment, useState, useEffect} from 'react'
import axios from 'axios';

import { Tabs, cnTabsTab  } from '@consta/uikit/Tabs';
import { Grid, GridItem  } from '@consta/uikit/Grid';
import { Button } from '@consta/uikit/Button';
import { Text  } from '@consta/uikit/Text';
import { IconSettings  } from '@consta/uikit/IconSettings';
import { Table } from '@consta/uikit/Table';
import { Card } from '@consta/uikit/Card';
import { Select } from '@consta/uikit/Select';
import { TextField  } from '@consta/uikit/TextField';
import { Loader } from '@consta/uikit/Loader';

import { Modal } from '@consta/uikit/Modal';

import '../css/main_css.css';

type Item = string;
const itemsCustomerMenu: Item[] = ['Планируются', 'Выбор подрядчика', 'Заключены', 'Завершены'];
const itemsExecutorMenu: Item[] = ['Выбор подрядчика', 'Заключены', 'Завершены'];

export const Contracts = (props) => {

    const [content, setContent] = useState([]);
    const [contentPlan, setContentPlan] = useState([]);
    const [contentEnd, setContentEnd] = useState([]);
    const [contentChoice, setContentChoice] = useState([]);
    const [ready, setReady] = useState(false)
    const [readyEx, setReadyEx] = useState(false)

    const [isAddContractModalOpen, setAddContractModalOpen] = useState(false)
    const [isUpdContractModalOpen, setUpdContractModalOpen] = useState(false)
    const [isGetContractModalOpen, setGetContractModalOpen] = useState(false)

    const username = props.username
    const role = props.role
    const items = ((role==='Исполнитель')?itemsExecutorMenu:itemsCustomerMenu)
    const columnsContracts = [
      { title: 'Реквизиты контракта', accessor: 'name', align: 'center', sortable: true, },
      { title: 'Описание', accessor: 'entity', align: 'center', sortable: true, },
      { title: 'Стоимость, руб', accessor: 'cost', align: 'center', sortable: true, },
      { title: 'Заказчик', accessor: 'customer_name', align: 'center',},
      { title: 'Подрядчик', accessor: 'executor_name', align: 'center',},
      { title: 'Статус', accessor: 'status', align: 'center', sortable: true, },
      //{ title: 'Действия', accessor: 'id',
      //  renderCell: (row) => <Button form='default' size='xs' iconSize="xs" view='ghost' label="Оборудование" />,
      //}
    ];


    const itemsStatus = [{'id': 1, 'label': 'Планируется'}, {'id': 2, 'label': 'Выбор подрядчика'}, {'id': 3, 'label': 'Заключен'}, {'id': 5, 'label': 'Завершен'}, {'id': 4, 'label': 'Удален'}]
    const [itemsExecutor, setItemsExecutor] = useState([])
    const [value, setValue] = useState(items[0]);

    const [valueExecutor, setValueExecutor] = useState(null);
    const [valueStatus, setValueStatus] = useState(itemsStatus[0]);
    const [valueTextContract, setValueTextContract] = useState(null);
    const [valueContract, setValueContract] = useState(null);
    const [valueContractPK, setValueContractPK] = useState(null)
    const [valueCostContract, setValueCostContract,] = useState(null)

    const handleUpdateActivate = (id, event) => {

        let tmp
        if(value === 'Планируются'){tmp=contentPlan}
        if(value === 'Выбор подрядчика'){tmp=contentChoice}
        if(value === 'Заключены'){tmp=content}
        if(value === 'Завершены'){tmp=contentEnd}

        tmp.map( (i) => {
                if(i.id===id) {
                    setValueContractPK(id)
                    setValueContract(i.name)
                    setValueCostContract(i.cost)
                    setValueTextContract(i.entity)
                    itemsStatus.map(y => {
                        if(y.label===i.status) {
                            setValueStatus(y)
                        }
                    })
                    itemsExecutor.map(y => {
                        if(y.label===i.executor_name) {
                            setValueExecutor(y)
                        }
                    })
                }
            })
        setUpdContractModalOpen(true)
    }

    const onChangeSelectExecutor = (event) => {
        setValueExecutor(event)
    }

    const onChangeSelectStatus = (event) => {
        setValueStatus(event)
    }

    const handleChangeContract = (event) => {
        setValueContract(event.value)
    }

    const handleChangeCost = (event) => {
        setValueCostContract(event.value)
    }

    const handleChangeText = (event) => {
        setValueTextContract(event.value)
    }

    const handleMoveToDevice = (event) => {
        window.location.assign('/devices?id='+valueContractPK);
    }

    const handleMoveToChat = (event) => {
        window.location.assign('/messenger?id='+valueContractPK);
    }


    const handleGetActivate = (event) => {
        setGetContractModalOpen(true)
    }


    const handleAddContract = (event) => {
        let addContractData = {
            'name': valueContract,
            'entity': valueTextContract,
            'status': valueStatus.label,
            'cost': valueCostContract,
            'username': username,
            'executorName': valueExecutor
        }
        console.log('addContract: ', addContractData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/addcontracts/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: addContractData,
                    }).then(response => {
                        setAddContractModalOpen(false)
                        window.location.reload();
                })
                .catch(error => {
                    console.log('Add Contract error: ' + error)
                    setAddContractModalOpen(false)
		        })
    }


    const handleUpdContract = (event) => {
        let updContractData = {
            'pk': valueContractPK,
            'name': valueContract,
            'entity': valueTextContract,
            'status': valueStatus.label,
            'cost': valueCostContract,
            'username': username,
            'executorName': valueExecutor
        }
        console.log('addContract: ', updContractData)
        axios({
                        method: "POST",
                            url: window.location.origin+'/api/updcontracts/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
                            data: updContractData,
                    }).then(response => {
                        setUpdContractModalOpen(false)
                        window.location.reload();
                })
                .catch(error => {
                    console.log('Update Contract error: ' + error)
                    setUpdContractModalOpen(false)
		        })

    }


    const handleOverlayClick = (event) => {
        setAddContractModalOpen(false)
    }

    const handleOverlayClickGet = (event) => {
        setGetContractModalOpen(false)
    }


    const handleOverlayClickUpd = (event) => {
        setUpdContractModalOpen(false)
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

                    let tmp1 = []
                    let tmp2 = []
                    let tmp3 = []
                    let tmp4 = []

                    response.data.map( i => {
                        i['id'] = i['pk']
                        if(i.status==='Заключен') {
                            tmp1.push(i)
                        }
                        else {
                            if(i.status==='Планируется') { tmp2.push(i) }
                            else { if(i.status==='Выбор подрядчика') { tmp3.push(i) }
                                   else {
                                          console.log('Завершен или удален !!!')
                                          if(i.status==='Завершен' || i.status==='Удален') { tmp4.push(i) }
                                   }
                            }
                        }
                        } )

                    setContent(tmp1)
                    setContentPlan(tmp2)
                    setContentChoice(tmp3)
                    setContentEnd(tmp4)
                    setReady(true)
                })
                .catch(error => {
                    console.log('Contracts error: ' + error)
                    setReady(false)
		        })

                // Executor list
                axios({
                        method: "GET",
                            url: window.location.origin+'/api/companies/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                }
                }).then(response => {
                    console.log('Companies:', response.data)
                    let tmpExecutor = []

                    response.data.map( (i,index) => {
                        //console.log('ex: ', i, '  ', index)
                        tmpExecutor.push({'id': index, 'label': i.name})
                    })
                    setItemsExecutor(tmpExecutor)
                    setReadyEx(true)
                })
                .catch(error => {
                    console.log('Executor error: ' + error)
                    setReadyEx(false)
		        })
            }, [])

        const styleGrid = {
            width: '100%',
        }
        const styleCard = {
            padding: '5px',
        }

        const divStyle = {
            marginLeft: '10px',
            marginTop: '5px',
            marginBottom: '5px',
        };

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
                            > Контракты </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />
                    <GridItem col="12" />
                    <GridItem col="1" />
                    <GridItem col="10">

                        <Tabs
                            value={value}
                            onChange={({ value }) => setValue(value)}
                            items={items}
                            getLabel={(items) => items}
                            view ="bordered"
                            size="m"
                            className = "tabstyle"
                            renderItem={({ className, ref, label, onChange, key }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={onChange}
                                    ref={ref}
                                    className={cnTabsTab(null, [className])}
                                >
                                    {label}
                                </button>
                                )}
                        />
                        </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12"/>

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        <Card style={styleCard}>
                            { (value === 'Планируются') && (ready===true) && (role==='Заказчик') && (
                                <>
                                    <Table columns={columnsContracts} rows={contentPlan} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e)} />
                                    <Button label = 'Добавить' id = '' form = 'brick' size='m' view='primary' onClick = {(event)=>setAddContractModalOpen(true)} />
                                </>
                            )}
                            { (value === 'Выбор подрядчика') && (ready===true) && (
                                    <Table columns={columnsContracts} rows={contentChoice} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e)} />
                            )}
                            { (value === 'Заключены') && (ready===true) && (
                                    <Table columns={columnsContracts} rows={content} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e)} />
                            )}
                            { (value === 'Завершены') && (ready===true) && (
                                    <Table columns={columnsContracts} rows={contentEnd} stickyHeader onRowClick={({id, e}) => handleUpdateActivate(id, e)} />
                            )}
                        </Card>
                    </GridItem>
                    <GridItem col="1" />
                </Grid>

            <Modal
                    className='ModalWindow'
                    isOpen={isAddContractModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClick()}
                    onEsc = {(): void => handleOverlayClick()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                Добавить контракт
                            </Text>
                            <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                                <TextField id='contractName' width = 'full' form = 'brick' name = "contractName" value = {valueContract} type = "text"
                                           label="Реквизиты контракта:" size="m" placeholder="" onChange = { handleChangeContract }
                                           className = "contractModalTextField"/>
                                <TextField id='contractText' width = 'full' form = 'brick' name = "contractText" value = {valueTextContract} type = "text"
                                           label="Описание контракта:" size="m" placeholder="" onChange = { handleChangeText}
                                           className = "contractModalTextField" />
                                <TextField id='contractCost' width = 'full' form = 'brick' name = "contractCost" value = {valueCostContract} type = "text"
                                           label="Стоимость контракта:" size="m" placeholder="" onChange = { handleChangeCost}
                                           className = "contractModalTextField" />
                                <Select label="Статус договора:" items = {itemsStatus} value = {valueStatus} id = "statusContract" width = 'full'
                                                            view="primary" labelPosition="left" name = "statusContract" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectStatus(value)}
                                                            className = "contractModalTextField" />
                                { (readyEx===true) && (
                                    <Select label="Подрядчик:" items = {itemsExecutor} value = {valueExecutor} id = "executorContract" width = 'full'
                                                                view="primary" labelPosition="left" name = "executorContract" type = "text"
                                                                size="l" onChange = {({value}) => onChangeSelectExecutor(value)}
                                                                className = "contractModalTextField" />
                                  )
                                }
                            </Card>
                            <Button label = 'Добавить' form = 'default' size='m' view='primary' onClick = {event => handleAddContract(event)}
                                                        className = "contractModalTextField" />
                            <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClick()}
                                                        className = "contractModalTextField" />
                        </Card>
                    </div>
            </Modal>

            <Modal
                    className='ModalWindow'
                    isOpen={isUpdContractModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickUpd()}
                    onEsc = {(): void => handleOverlayClickUpd()}
            >
                    <div>
                        <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                            <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                { (role==='Заказчик')?'Изменить данные контракта':'Просмотр информации о контракте' }
                            </Text>
                            <Card className="cardinfostyle" verticalSpace="xl" horizontalSpace="xl">
                            { (role==='Заказчик' ) && ((value==='Планируются') || (value==='Выбор подрядчика')) && (
                                <>
                                    <TextField id='contractName' width = 'full' form = 'brick' name = "contractName" value = {valueContract} type = "text"
                                               label="Реквизиты контракта:" size="m" placeholder="" onChange = {handleChangeContract} className = "contractModalTextField"/>
                                    <TextField id='contractText' width = 'full' form = 'brick' name = "contractText" value = {valueTextContract} type = "text"
                                               label="Описание контракта:" size="m" placeholder="" onChange = {handleChangeText} className = "contractModalTextField" />
                                    <TextField id='contractCost' width = 'full' form = 'brick' name = "contractCost" value = {valueCostContract} type = "text"
                                               label="Стоимость контракта:" size="m" placeholder="" onChange = { handleChangeCost}
                                               className = "contractModalTextField" />
                                    <Select label="Подрядчик:" items = {itemsExecutor} value = {valueExecutor} id = "executorContract" width = 'full'
                                               view="primary" labelPosition="left" name = "executorContract" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectExecutor(value)} className = "contractModalTextField" />
                                    <Select label="Статус контракта:" items = {itemsStatus} value = {valueStatus} id = "statusContract" width = 'full'
                                               view="primary" labelPosition="left" name = "statusContract" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectStatus(value)} className = "contractModalTextField" />
                                </>
                            )}

                            { (role==='Заказчик' ) && ((value === 'Заключены') || (value === 'Завершены')) && (
                                <>
                                    <TextField id='contractName' width = 'full' form = 'brick' name = "contractName" value = {valueContract} type = "text"
                                               label="Реквизиты контракта:" size="m" placeholder="" onChange = { handleChangeContract } className = "contractModalTextField" disabled />
                                    <TextField id='contractText' width = 'full' form = 'brick' name = "contractText" value = {valueTextContract} type = "text"
                                               label="Описание контракта:" size="m" placeholder="" onChange = { handleChangeText} className = "contractModalTextField" disabled />
                                    <TextField id='contractCost' width = 'full' form = 'brick' name = "contractCost" value = {valueCostContract} type = "text"
                                               label="Стоимость контракта:" size="m" placeholder="" onChange = { handleChangeCost} disabled
                                               className = "contractModalTextField" />
                                    <TextField id='valueExecutor' width = 'full' form = 'brick' name = "valueExecutor" value = {(valueExecutor!==null)?valueExecutor.label:null} type = "text"
                                               label="Подрядчик:" size="m" placeholder="" className = "contractModalTextField" disabled />
                                    <Select label="Статус контракта:" items = {itemsStatus} value = {valueStatus} id = "statusContract" width = 'full'
                                               view="primary" labelPosition="left" name = "statusContract" type = "text" size="l"
                                               onChange = {({value}) => onChangeSelectStatus(value)} className = "contractModalTextField" />
                                </>
                            )}

                            { (role!=='Заказчик' ) && (
                                <>
                                    <TextField id='contractName' width = 'full' form = 'brick' name = "contractName" value = {valueContract} type = "text"
                                               label="Реквизиты контракта:" size="m" placeholder="" onChange = { handleChangeContract }
                                               className = "contractModalTextField" disabled />
                                    <TextField id='contractText' width = 'full' form = 'brick' name = "contractText" value = {valueTextContract} type = "text"
                                               label="Описание контракта:" size="m" placeholder="" onChange = { handleChangeText}
                                               className = "contractModalTextField" disabled />
                                    <TextField id='contractCost' width = 'full' form = 'brick' name = "contractCost" value = {valueCostContract} type = "text"
                                               label="Стоимость контракта:" size="m" placeholder="" onChange = { handleChangeCost} disabled
                                               className = "contractModalTextField" />
                                    <TextField id='statusContract' width = 'full' form = 'brick' name = "statusContract" value = {valueStatus.label} type = "text"
                                               label="Статус контракта:" size="m" placeholder="" className = "contractModalTextField" disabled />
                                    <TextField id='valueExecutor' width = 'full' form = 'brick' name = "valueExecutor" value = {(valueExecutor!==null)?valueExecutor.label:null} type = "text"
                                               label="Подрядчик:" size="m" placeholder="" className = "contractModalTextField" disabled />
                                </>
                            ) }
                            </Card>

                            { (role==='Заказчик' ) && (
                                <>
                                    <Button label = 'Обновить' form = 'default' size='m' view='primary' onClick = {event => handleUpdContract(event)}
                                                 className = "contractModalTextField" />
                                    <Button label = 'Отмена' form = 'default' size='m' view='primary' onClick = {event => handleOverlayClickUpd()}
                                                 className = "contractModalTextField" />
                                    <div className="divblockstyle" >
                                        <Button label = 'Перечень оборудования' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToDevice(event)}
                                                      className = "contractModalTextField" />
                                        <Button label = 'Документы контракта' form = 'default' size='m' view='ghost' onClick = {event => handleGetActivate(event)}
                                                                    className = "contractModalTextField" />
                                        <Button label = 'Войти в Чат' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToChat(event)}
                                                                    className = "contractModalTextField" />
                                    </div>
                                </>
                            )}

                            { (role!=='Заказчик' ) && (
                                <>
                                    <Button label = 'Перечень оборудования' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToDevice(event)}
                                                                className = "contractModalTextField" />
                                    <Button label = 'Документы контракта' form = 'default' size='m' view='ghost' onClick = {event => handleGetActivate(event)}
                                                                className = "contractModalTextField" />
                                    <Button label = 'Войти в Чат' form = 'default' size='m' view='ghost' onClick = {event => handleMoveToChat(event)}
                                                                className = "contractModalTextField" />
                                </>
                            )}
                        </Card>
                    </div>
            </Modal>


            <Modal
                    className='ModalWindow'
                    isOpen={isGetContractModalOpen}
                    hasOverlay= {true}
                    width="auto"
                    onOverlayClick= {(): void => handleOverlayClickGet()}
                    onEsc = {(): void => handleOverlayClickGet()}
            >
                <Text as="div" style={divStyle} size="xl" view="brand" className='divblockloaderstyle' align="center" display='block'> Получение данных из ТОИР</Text>
                <div className='divblockloaderstyle'>
                        <Loader />
                </div>
            </Modal>


            </Fragment>
    )
}
