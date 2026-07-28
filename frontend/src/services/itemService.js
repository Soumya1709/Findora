import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/items`,
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

API.interceptors.response.use(
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

export const createItem = (itemData) =>
  API.post("/", itemData);

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

export const getAIMatches = async (itemId) => {
  const res = await API.get(`/${itemId}/matches`);
  return res.data;
};

export const markItemReturned = (id) =>
  API.patch(`/${id}/return`);

export const markMatchSeen = async (
  reportId,
  matchId
) => {
  const token = localStorage.getItem("token");

  return axios.patch(
    `/items/matches/${reportId}/${matchId}/seen`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};