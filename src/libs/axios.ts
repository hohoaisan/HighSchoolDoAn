import axios, { AxiosRequestConfig, ResponseType, AxiosError } from 'axios';
export const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};
export default axios.create(config);
