import axios from "axios";
const API_URL = "https://e-com-app-server-l8sd.onrender.com/api";
const api = axios.create({
    baseURL: API_URL,
});

export default api;