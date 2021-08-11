import React from 'react';
import { useRouter } from 'next/router';
import { Typography, Button, IconButton, Grid } from '@material-ui/core';
import useUser from 'hooks/useUser';
import logout from 'api/logout';

function Indicator() {
  const router = useRouter();
  const { user, loading, error, mutateUser } = useUser();
  if (!user?.isLoggedIn) {
    return <div></div>;
  }
  const name = user.info?.name;
  const handleLogout = async () => {
    await logout();
    mutateUser();
  };
  return (
    <div>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Typography>{name}</Typography>
        </Grid>
        <Grid item>
          <Button color="inherit" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
export default Indicator;
