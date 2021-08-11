import axios from 'axios';
import AuthStore from "@/store/modules/auth";

export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 10 * 1000,
    headers: {
      Authorization: `Bearer ${AuthStore.token}`,
    }
  });
};