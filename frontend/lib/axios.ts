import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL || "http://localhost:3002",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = getToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    //console.log("config: " + JSON.stringify(config));
    //console.log("url: " + config?.url);
    //console.log("Mensagem: " + process.env.BACKEND_URL);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

