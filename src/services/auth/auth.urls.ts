import { BaseURLs } from "../types";

export interface AuthUrls extends BaseURLs {
  login: string;
  perfil: string;
  changePassword: string;
  getConfigs: string;
}

export const AUTH_URLS: AuthUrls = {
  login: "auth/login/",
  perfil: "auth/perfil/",
  changePassword: "auth/change-password/",
  getConfigs: "auth/configs/",
};
