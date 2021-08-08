import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import DashboarHomeLayout from 'components/layouts/DashboardHomeLayout';
import { Typography, Container, Grid, Paper } from '@material-ui/core';

import useStyles from 'styles/Dashboard/common';

export default function Index() {
  const classes = useStyles();
  return (
    <DashboarHomeLayout>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography>Trang chủ</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      </DashboarHomeLayout>
  );
}
