import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DashboardHocSinhLayout from 'components/layouts/DashboardHocSinhLayout';
import { Typography, Container, Grid, Paper } from '@material-ui/core';
import useStyles from 'styles/Dashboard/common';

export default function Index() {
  const classes = useStyles();
  return (
    <DashboardHocSinhLayout>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography>Trang chủ học sinh</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardHocSinhLayout>
  );
}
