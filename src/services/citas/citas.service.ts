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
}
