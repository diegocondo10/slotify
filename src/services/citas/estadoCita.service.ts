import { BaseService } from "../base";
import { ESTADO_CITA_URLS, EstadoCitaUrls } from "./estadoCita.urls";

export class EstadoCitaService extends BaseService<EstadoCitaUrls> {
  getUrls(): EstadoCitaUrls {
    return ESTADO_CITA_URLS;
  }
  async listAsLabelValue() {
    return (await this.publicApi.get(this.urls.listAsLabelValue)).data;
  }
}
