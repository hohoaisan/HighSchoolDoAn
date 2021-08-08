import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardPhuHuynhLayout from 'components/layouts/DashboardPhuHuynhLayout';
import { Typography, Container, Grid, Paper } from '@material-ui/core';
import useStyles from 'styles/Dashboard/common';

export default function Index() {
  const classes = useStyles();
  return (
    <DashboardPhuHuynhLayout>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography>Trang chủ Phụ Huynh</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardPhuHuynhLayout>
  );
}
