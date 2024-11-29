import { BaseService } from "../base";
import { TAG_CITA_URLS, TagCitaUrls } from "./tagCita.urls";

export class TagCitaService extends BaseService<TagCitaUrls> {
  getUrls(): TagCitaUrls {
    return TAG_CITA_URLS;
  }
  async listAsLabelValue(): Promise<any[]> {
    return (await this.privateApi.get(this.urls.listAsLabelValue)).data;
  }
  async listAsLabelValueAll(): Promise<any[]> {
    return (await this.privateApi.get(this.urls.listAsLabelValueAll)).data;
  }
}
