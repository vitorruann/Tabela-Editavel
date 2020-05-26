import axios from 'axios'

const api = axios.create({
    baseURL: 'http://10.1.43.35:8050'
});

export default api;