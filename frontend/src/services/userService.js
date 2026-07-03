import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

API.interceptors.request.use((config) => {
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

export const updateProfile = (
  data
) =>
  API.put(
    "/profile",
    data
  );