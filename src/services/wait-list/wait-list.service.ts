import { PK } from "@/types/api";
import { BaseService } from "../base";
import { WAIT_LIST_URLS, WaitListUrls } from "./wait-list.urls";

export class WaitListService extends BaseService<WaitListUrls> {
  getUrls(): WaitListUrls {
    return WAIT_LIST_URLS;
  }
  async check(pk: PK, checked?: boolean) {
    return (await this.privateApi.put(this.urls.check(pk), { checked })).data;
  }
  async archivar(pk: PK, archived?: boolean) {
    return (await this.privateApi.put(this.urls.archivar(pk), { archived })).data;
  }
  async createOrUpdate(body: Record<string, any>) {
    return (await this.privateApi.post(this.urls.createOrUpdate, body)).data;
  }
}
