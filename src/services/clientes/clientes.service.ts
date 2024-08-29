import { BaseService } from "../base";
import { CLIENTES_URLS, ClientesUrls } from "./clientes.urls";

export class ClienteService extends BaseService<ClientesUrls> {
  getUrls(): ClientesUrls {
    return CLIENTES_URLS;
  }
  async listAsLabelValue() {
    return (await this.privateApi.get(this.urls.listAsLabelValue)).data;
  }
  async createBasic(fullName: string): Promise<{ id: string; fullName: string }> {
    return (await this.privateApi.post(this.urls.createBasic, { fullName })).data;
  }
}
