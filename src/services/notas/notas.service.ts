import { BaseService } from "../base";
import { NOTAS_URLS, NotasUrls } from "./notas.urls";

export class NotaService extends BaseService<NotasUrls> {
  getUrls(): NotasUrls {
    return NOTAS_URLS;
  }
  async listByDate(fecha: string) {
    return (await this.privateApi.get(this.urls.listByDate(fecha))).data;
  }
}
