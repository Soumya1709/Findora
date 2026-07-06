import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
});

export const signup = (userData) =>
  API.post("/signup", userData);

export const googleLogin = (accessToken) =>
  API.post("/google", {accessToken,});

export const login = (userData) =>
  API.post("/login", userData);

export const deleteAccount = () =>
  API.delete("/delete-account");