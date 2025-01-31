import axios, { CreateAxiosDefaults } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
  baseURL,
  // timeout: 10000,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
  },
});
export const createApi = (config?: CreateAxiosDefaults) => {
  return axios.create({
    baseURL,
    // timeout: 10000,
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    },
    ...config,
  });
};

export default API;
