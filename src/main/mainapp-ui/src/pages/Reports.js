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

import { Gauge } from '@consta/charts/Gauge';
import { Bullet } from '@consta/charts/Bullet';
import { Pie } from '@consta/charts/Pie';
import { Column } from '@consta/charts/Column';

import '../css/main_css.css';

export const Reports = () => {

    const itemsReport = [{'id': 1, 'label': 'Контракты'}, {'id': 2, 'label': 'Подрядчики'},]
    const [valueReport, setValueReport] = useState(null)
    const [readyChoice, setReadyChoice] = useState(false)
    const [reportUpdate, setReportUpdate] = useState(false)
    const [readyContent, setReadyContent] = useState(false)

    const optionsGauge = {
        percent: 0.75,
    }

    const [dataPie, setDataPie] = useState([])
    const [dataColumn, setDataColumn] = useState([])

    const onChangeSelectReport = (event) => {

        if(reportUpdate===false) {
            setReportUpdate(true)
        }
        else {
            setReportUpdate(false)
        }

        setReadyContent(false)
        setValueReport(event)
        setReadyChoice(true)
    }

    useEffect(()=>{

        if(valueReport!==null){
            let rData = {'report': valueReport}
            axios({
                    method: "POST",
                    url: window.location.origin+'/api/reports/',
                    headers:
                          {
                           Authorization : 'JWT '+ localStorage.getItem('token'),
                          },
                    data: rData,
                    }).then(response => {
                        console.log(response.data)
                        setDataColumn(response.data['dataColumn'])
                        setDataPie(response.data['dataPie'])
                        setReadyContent(true)
    //                  window.location.reload();
                    })
                    .catch(error => {
                        console.log('Report error: ' + error)
                        setReadyContent(false)
                    })
        }
    }, [valueReport])

    useEffect(()=>{
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
                            > Отчеты </Text>
                        </div>
                    </GridItem>
                    <GridItem col="1" />

                    <GridItem col="12" />

                    <GridItem col="1" />
                    <GridItem col="2" style={styleGrid} >
                        <Select label="Выберите отчет:" items = {itemsReport} value = {valueReport} id = "reportList" width="full"
                                                            view="primary" labelPosition="left" name = "reportList" type = "text"
                                                            size="l" onChange = {({value}) => onChangeSelectReport(value)}
                                                            placeholder="Выберите отчет" className = "contractModalTextField" />
                    </GridItem>
                    <GridItem col="8" />
                    <GridItem col="1" />

                    <GridItem col="1" />
                    <GridItem col="10" style={styleGrid} >
                        { (valueReport!==null) && (valueReport.label==='Подрядчики') && (readyContent===true) && (
                         <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                               <Grid cols="12">
                                    <GridItem col="12" />
                                    <GridItem col="6" >
                                        <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                            Заключено контрактов
                                        </Text>
                                    </GridItem>
                                    <GridItem col="6" >
                                        <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                            Выручка, руб
                                        </Text>
                                    </GridItem>
                                    <GridItem col="12" />
                                    <GridItem col="6" >
                                        <Pie style={{ width: 600, height: '100%' }} data={dataPie} angleField="value" colorField="type" innerRadius={0.64}
                                                statistic={{ title: false, content:false, }} label={{ type: 'inner', offset: '-50%', content: '{value}',
                                                style: { textAlign: 'center', fontSize: 14, }, }} />
                                    </GridItem>
                                    <GridItem col="6" >
                                        <Column style={{ marginBottom: 'var(--space-m)', maxWidth: 500, maxHeight: 200 }} data={dataColumn}
                                                xField="param" yField="value" />
                                    </GridItem>
                                    <GridItem col="12" />
                               </Grid>
                        </Card>
                        ) }


                        { (valueReport!==null) && (valueReport.label==='Контракты') && (readyContent===true) && (
                         <Card className="contractModalCard" verticalSpace="xl" horizontalSpace="xl">
                               <Grid cols="12">
                                    <GridItem col="12" />
                                    <GridItem col="6" >
                                        <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                            Статус контрактования
                                        </Text>
                                    </GridItem>
                                    <GridItem col="6" >
                                        <Text as="div" size="xl" view="brand" weight="bold" align="center" display='block' className = "contractModalTextField">
                                            Расходная часть
                                        </Text>
                                    </GridItem>
                                    <GridItem col="12" />
                                    <GridItem col="6" >
                                        <Pie style={{ width: 600, height: '100%' }} data={dataPie} angleField="value" colorField="type" innerRadius={0.64}
                                                statistic={{ title: false, content:false, }} label={{ type: 'inner', offset: '-50%', content: '{value}',
                                                style: { textAlign: 'center', fontSize: 14, }, }} />
                                    </GridItem>
                                    <GridItem col="6" >
                                        <Column style={{ marginBottom: 'var(--space-m)', maxWidth: 500, maxHeight: 200 }} data={dataColumn}
                                                xField="param" yField="value" />
                                    </GridItem>
                                    <GridItem col="12" />
                               </Grid>
                        </Card>
                        ) }


                    </GridItem>
                    <GridItem col="1" />
                </Grid>

        </Fragment>
    )
}
