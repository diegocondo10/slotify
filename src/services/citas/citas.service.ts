import { PK } from "@/types/api";
import { toBackDate } from "@/utils/date";
import { BaseService } from "../base";
import { CITAS_URLS, CitaUrls } from "./citas.urls";

export class CitaService extends BaseService<CitaUrls> {
  getUrls(): CitaUrls {
    return CITAS_URLS;
  }

  async printList(search: string) {
    return await this.requestReport(this.urls.printList(search));
  }

  async payReportXlsx(start: Date, end: Date) {
    return await this.requestReport(this.urls.payReportXlsx(toBackDate(start), toBackDate(end)));
  }

  async listByRange(start: Date, end: Date) {
    return (await this.privateApi.get(this.urls.listByRange(toBackDate(start), toBackDate(end))))
      .data;
  }

  async reporteStats(start: Date, end: Date) {
    return (
      await this.privateApi.get(this.urls.reporteEstadisticas(toBackDate(start), toBackDate(end)))
    ).data;
  }

  async reporteListStats(start: Date, end: Date) {
    return (
      await this.privateApi.get(this.urls.reporteListStats(toBackDate(start), toBackDate(end)))
    ).data;
  }

  async payReport(start: Date, end: Date) {
    return (await this.privateApi.get(this.urls.payReport(toBackDate(start), toBackDate(end))))
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
