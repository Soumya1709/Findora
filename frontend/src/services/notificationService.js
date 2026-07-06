import axios from "axios";

const notificationAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/notifications`,
});

notificationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};

  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return config;
});

notificationAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getNotifications = () =>
  notificationAPI.get("/");

export const markNotificationRead =(id) =>
    notificationAPI.patch(`/${id}/read`);