import { BaseService } from "../base";
import { NOTAS_URLS, NotasUrls } from "./notas.urls";

export class NotaService extends BaseService<NotasUrls> {
  getUrls(): NotasUrls {
    return NOTAS_URLS;
  }
  async oneByDate(fecha: string) {
    return (await this.privateApi.get(this.urls.oneByDate(fecha))).data;
  }
  async creteOrUpdate(fecha: string, data: any) {
    return (await this.privateApi.post(this.urls.createOrUpdate(fecha), data)).data;
  }
}
