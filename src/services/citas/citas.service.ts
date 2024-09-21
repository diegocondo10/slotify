import { PK } from "@/types/api";
import { toBackDate } from "@/utils/date";
import { BaseService } from "../base";
import { CITAS_URLS, CitaUrls } from "./citas.urls";

export class CitaService extends BaseService<CitaUrls> {
  getUrls(): CitaUrls {
    return CITAS_URLS;
  }

  async listByRange(start: Date, end: Date) {
    return (await this.privateApi.get(this.urls.listByRange(toBackDate(start), toBackDate(end))))
      .data;
  }

  async reagendar(id: PK, body: any) {
    return (await this.privateApi.put(this.urls.reagendar(id), body)).data;
  }

  async pagar(id: PK) {
    return (await this.privateApi.put(this.urls.pagar(id))).data;
  }

  async cambiarEstado(pk: PK, idEstado: PK): Promise<any> {
    return (await this.privateApi.put(this.urls.cambiarEstado(pk), { idEstado })).data;
  }
}
