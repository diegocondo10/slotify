import axios, { CreateAxiosDefaults } from "axios";

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_SERVER // URL de la API real en SSR desde el servidor
    : process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT;

const API = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
  },
});
export const createApi = (config?: CreateAxiosDefaults) => {
  return axios.create({
    baseURL,
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
