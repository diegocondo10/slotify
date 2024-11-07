import { PK } from "@/types/api";
import { BaseService } from "../base";
import { ESTADO_CITA_URLS, EstadoCitaUrls } from "./estadoCita.urls";

export class EstadoCitaService extends BaseService<EstadoCitaUrls> {
  getUrls(): EstadoCitaUrls {
    return ESTADO_CITA_URLS;
  }
  async listAsLabelValue(): Promise<any[]> {
    return (await this.privateApi.get(this.urls.listAsLabelValue)).data;
  }
}
