import axios from "axios";

const api = axios.create({
  baseURL: "https://cislu-web-app-backend.onrender.com/api",
});

export default api;
