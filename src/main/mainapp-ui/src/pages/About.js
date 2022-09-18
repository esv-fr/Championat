import React, {Fragment} from 'react';

import { Grid, GridItem  } from '@consta/uikit/Grid';
import { Informer } from '@consta/uikit/Informer';

import '../css/main_css.css';

export const About = () => {

return (
    <Fragment>
        <Grid cols="12" gap="xs" xAlign='left' breakpoints={{ xs: { colgap: 'xs', }, m: { colgap: 'm', }, }} >
            <GridItem col="12" />
            <GridItem col="1" />
            <GridItem col="10" className="gridstyle" >
                <Informer
                  status="system"
                  view="filled"
                  width="full"
                  title="Динамикс - это цифровая система коммуникаций подрядных организаций и профильных сотрудников ВИНК"
                  label="Для начала работы войдите в систему"
                  align="center"
                  className="informstyle"
                />
            </GridItem>
            <GridItem col="1" />
    </Grid>
    </Fragment>
)
}