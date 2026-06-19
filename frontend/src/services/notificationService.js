import axios from "axios";

const notificationAPI = axios.create({
  baseURL: "http://localhost:5000/api/notifications",
});

notificationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getNotifications = () =>
  notificationAPI.get("/");

export const markNotificationRead =(id) =>
    notificationAPI.patch(`/${id}/read`);