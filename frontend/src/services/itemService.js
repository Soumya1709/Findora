import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/items",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createItem = (itemData) =>
  API.post("/", itemData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getMyItems = () =>
  API.get("/my-items");

export const getAllItems = () =>
  API.get("/");

export const deleteItem = (id) =>
  API.delete(`/${id}`);

export const updateItem = (id, itemData) =>
  API.put(`/${id}`, itemData);

export const getSimilarItems = (id) =>
  API.get(`/similar/${id}`);

export const getItemById = (id) =>
  API.get(`/${id}`);