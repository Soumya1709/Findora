import axios from "axios";

const claimAPI = axios.create({
  baseURL: "http://localhost:5000/api/claims",
});

claimAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export const createClaim = (itemId) =>
  claimAPI.post(`/${itemId}`);