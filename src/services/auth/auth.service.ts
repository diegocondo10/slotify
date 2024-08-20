import { BaseService } from "../base";
import { AUTH_URLS, AuthUrls } from "./auth.urls";

export class AuthService extends BaseService<AuthUrls> {
  getUrls(): AuthUrls {
    return AUTH_URLS;
  }

  async login(email: string, password: string) {
    return (
      await this.publicApi.post(this.urls.login, {
        email,
        password,
      })
    ).data;
  }

  async perfil() {
    return (await this.privateApi.get(this.urls.perfil)).data;
  }
}
