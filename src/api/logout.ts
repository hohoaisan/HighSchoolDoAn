import axios from 'libs/axios';

export default async function logout() {
  await axios({
    method: 'post',
    url: '/api/logout',
  });
}
