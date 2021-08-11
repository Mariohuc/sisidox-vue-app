import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_PUBLIC_BASE_URL,
    timeout: 10 * 1000
  });
};