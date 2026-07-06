import axios from "axios";

const claimAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/claims`,
});

claimAPI.interceptors.request.use((config) => {
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

export const createClaim = (itemId) =>
  claimAPI.post(`/${itemId}`);

export const getMyItemClaims = () =>
  claimAPI.get("/my-item-claims");

export const updateClaimStatus = (claimId,status) =>
  claimAPI.patch(`/${claimId}`,{ status });

export const getClaimById = (id) =>
  claimAPI.get(`/${id}`);

export const checkCanViewOwner =(itemId) =>
    claimAPI.get(`/can-view-owner/${itemId}`);