//axiosInstance.js
import Axios from 'axios';
const axios=Axios.create({
    baseURL: 'http://localhost:5500/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axios;