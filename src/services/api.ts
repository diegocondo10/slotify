import axios, { CreateAxiosDefaults } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
  },
});
export const createApi = (config?: CreateAxiosDefaults) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
      "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    },
    ...config,
  });
};
// API.interceptors.request.use(
//   async (config) => {
//     const session = await getSession();
//     if (session?.accessToken) {
//       config.headers.Authorization = `Bearer ${session.accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default API;
