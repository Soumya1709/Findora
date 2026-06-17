import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const signup = (userData) =>
  API.post("/signup", userData);

export const googleLogin = (accessToken) =>
  API.post("/google", {accessToken,});

export const login = (userData) =>
  API.post("/login", userData);