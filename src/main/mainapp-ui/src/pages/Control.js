import React, {Fragment, useState, useEffect} from 'react';
import axios from 'axios';

import { Tabs } from '@consta/uikit/Tabs';
import { Grid, GridItem  } from '@consta/uikit/Grid';

import { IconAllDone } from '@consta/uikit/IconAllDone';
import { IconLayers } from '@consta/uikit/IconLayers';
import { IconPanelTop } from '@consta/uikit/IconPanelTop';
import { TextField  } from '@consta/uikit/TextField';

import { Text  } from '@consta/uikit/Text';
import { Card  } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';

import '../css/main_css.css';

export const Control = (props) => {

    const [state, setState] = useState();
    const [fileUploading, setFileUploading] = useState('false')
    const [fileNameDownload, setFileNameDownload] = useState(null)
    const [valuePath, setValuePath] = useState()
    const handleChange = (event) => {
        setFileNameDownload(event.value)
    }

    const role = props.role

    useEffect(()=>{
    }, [])


    const handleUpload = (event, action) => {
        event.preventDefault();
        let data = new FormData();

        for (let file of state.files) {
            data.append('files', file);
        }
        data.append('path', valuePath);

        axios({
               method: "POST",
               url: window.location.origin + '/api/upload/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
               data: data,
        }).then(response => {
                    console.log(response.data)
        })
        .catch(error => {
                    console.log('API File Upload: ' + error)
        })
    }


    const handleUploadXmlWITSML = (event, action) => {
        event.preventDefault();
        let data = new FormData();

        for (let file of state.files) {
            data.append('files', file);
        }

        axios({
               method: "POST",
               url: window.location.origin + '/api/upload_xml_witsml/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
               data: data,
        }).then(response => {
                    console.log(response.data)
        })
        .catch(error => {
                    console.log('API File Xml WITSML Upload: ' + error)
        })
    }

    const handleChangePath = (event) => {
        setValuePath(event.value)
    }

    const handleDownloadFile = (event) => {
        event.preventDefault();
        axios({
               method: "POST",
               url: window.location.origin + '/api/download/',
                            headers:
                                {
                                    Authorization : 'JWT '+ localStorage.getItem('token'),
                                },
               responseType: 'blob',
               data: {'filename': fileNameDownload},
               }).then(response => {
                   const url = window.URL.createObjectURL(new Blob([response.data]));
                   const link = document.createElement('a');
                   link.href = url;
                   link.setAttribute('download', fileNameDownload.split('/').pop());
                   document.body.appendChild(link);
                   link.click();
                  })
               .catch(error => {
                    console.log('API Download File: '+ error)
               })
    }

    const handleFileChange = (event) => {
       event.preventDefault();
       setState({files: event.target.files})
       setFileUploading(true)
    }


    return(
        <Fragment>
                <Grid  cols="12" gap="xs" xAlign='left' breakpoints={{ xs: { colgap: 'xs', },
                                                                       m: {  colgap: 'm',  },
                }} >
                    <GridItem col="12" row="3"/>

                    <GridItem col="1" />
                    <GridItem col="8">
                            <Text view="brand" size="xl" weight="bold" lineHeight="l" align="left" >
                                {(role==='Администратор')?'Инструменты для администратора':'Инструменты для инженера'}
                            </Text>
                    </GridItem>
                    <GridItem col="12" row="3"/>

                    <GridItem col="12" row="1"/>

                    <GridItem col="1" />
                    <GridItem className="gridstyle" col="8">
                        <Card className="rulecard" verticalSpace="xl" horizontalSpace="xl">
                                <Text view="brand" size="xl" weight="bold" lineHeight="l" align="left" > Загрузка xml файла формата WITSML в контейнер </Text>
                                   <div className="previewComponent">
                                        <form onSubmit={(event)=>handleUploadXmlWITSML(event)}>
                                            <input className="fileInput" type="file" onChange={(event)=>handleFileChange(event) } accept=".xml" multiple={false} />
                                            <Button className="submitButton" label = 'Загрузить файл' id = 'UploadXmlWITSML' width = 'full' form = 'brick' size='l' view='clear' onClick={(event)=>handleUploadXmlWITSML(event)} />
                                        </form>
                                   </div>
                        </Card>
                        {(role==='Администратор') && (
                        <>
                            <Card className="rulecard" verticalSpace="xl" horizontalSpace="xl">
                                    <Text view="brand" size="xl" weight="bold" lineHeight="l" align="left" > Загрузка файла в контейнер </Text>
                                       <div className="previewComponent">
                                            <form onSubmit={(event)=>handleUpload(event)}>
                                                <input className="fileInput" type="file" onChange={(event)=>handleFileChange(event) } accept=".xml,.json" multiple={false} />
                                                <TextField id='pathFolder' width = 'full' form = 'brick' name = "pathFolder" value = {valuePath} type = "text"
                                                           label="Путь до папки с именем файла:" size="m" placeholder="" onChange = { handleChangePath }
                                                           className = "contractModalTextField"/>

                                                <Button className="submitButton" label = 'Загрузить файл' id = 'uploadFile' width = 'full' form = 'brick' size='l' view='clear' onClick={(event)=>handleUpload(event)} />
                                            </form>
                                       </div>
                            </Card>
                            <Card className="rulecard" verticalSpace="xl" horizontalSpace="xl">
                                       <Text view="brand" size="xl" weight="bold" lineHeight="l" align="left" > Скачать файл из контейнера </Text>
                                       <div className="previewComponent">
                                            <form onSubmit={(event)=>handleDownloadFile(event)}>
                                                <TextField id = "fileNameDownload" labelPosition="left" width = 'full' type='text'
                                                name = "nomination" value = {fileNameDownload}  size="m" placeholder="" onChange = {handleChange} />
                                                <Button className="submitButton" label = 'Скачать' id = 'downloadPlan' width = 'full' form = 'brick' size='l' view='clear' onClick={(event)=>handleDownloadFile(event)} />
                                            </form>
                                       </div>
                            </Card>
                        </>)}

                    </GridItem>

                    <GridItem className="gridstyle" col="3" />
            </Grid>
        </Fragment>
    )
}