import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { toast } from 'react-toastify';
import useUser from 'hooks/useUser';
import login from 'api/giaovien/login';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Grid,
  Box,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { user, loading, error, mutateUser } = useUser({ redirectTo: '/', redirectIfFound: true });
  const handleEmailChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setEmail(event.target.value.trim());
  }, []);
  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPassword(event.target.value.trim());
  }, []);

  const handleSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error('Phải nhập đủ trường dữ liệu');
      return;
    }
    try {
      await login(email, password);
      mutateUser();
    } catch (err) {
      toast.error('Có lỗi xảy ra khi đăng nhập');
      console.log(err);
    }
  };

  if (loading) {
    return <div></div>;
  }
  if (error) {
    return (
      <Grid container component="main" className={classes.root}>
        <Typography>Có lỗi xảy ra vui lòng tải lại</Typography>
      </Grid>
    );
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Giáo viên Đăng nhập
          </Typography>
          <form className={classes.form} noValidate method="post" onSubmit={handleSubmitForm}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Email"
              name="username"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Đăng nhập
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
