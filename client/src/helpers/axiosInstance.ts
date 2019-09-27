import axios, { AxiosInstance } from 'axios';


export const api: AxiosInstance = axios.create({
  baseURL: 'http://192.168.0.104:5000'
});

export default api;