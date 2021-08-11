import React from 'react';

import { Typography, Container, Grid, Paper } from '@material-ui/core';
import useStyles from 'styles/Dashboard/common';

import UserType from 'enums/UserType';
import TeacherRole from 'enums/TeacherRole';
import useUser from 'hooks/useUser';
interface Props {
  children: JSX.Element;
  type: UserType;
  roles?: TeacherRole[];
}

const loginUrl = (type: UserType): string => {
  switch (type) {
    case UserType.GIAOVIEN:
      return '/auth/giaovien/signin';
  }
  return '/';
};

const ProtectedPage: React.FC<Props> = ({ children, type, roles }) => {
  const { user, loading } = useUser({ redirectTo: loginUrl(type) });
  const classes = useStyles();
  if (user && user.info?.type !== type && !roles?.every((value: TeacherRole) => !!user.info?.roles?.includes(value))) {
    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography>Bạn không có quyền truy cập trang này</Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }
  return <>{children}</>;
};

export default ProtectedPage;
