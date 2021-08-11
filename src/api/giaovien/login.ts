import axios from 'libs/axios';

export default async function login(email: string, password: string) {
  await axios({
    method: 'post',
    url: '/api/giaovien/login',
    data: {
      email,
      password,
    },
  });
}
