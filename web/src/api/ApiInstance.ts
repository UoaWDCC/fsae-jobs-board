import axios from "axios";

const base_url = "http://localhost:3000/" // Todo: Move to env or config file file

export const apiInstance = axios.create({
  baseURL: base_url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Intercept requests
// Add access token to headers
apiInstance.interceptors.request.use(
  config => {
    console.log("interceptted add auth token")
    const accessToken = localStorage.getItem('accessToken');
    console.log(`token is ${accessToken}`)
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// Intercept responses
// Handle 401 Unauthorized
apiInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      // Todo: Can intercept 401 requests
    }
    return Promise.reject(error);
  }
);
