import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Works with the proxy setup
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
