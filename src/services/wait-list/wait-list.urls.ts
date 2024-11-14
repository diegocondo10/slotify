import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface WaitListUrls extends BaseURLs {
  check: (pk: PK) => string;
  archivar: (pk: PK) => string;
  createOrUpdate: string;
}

export const WAIT_LIST_URLS: WaitListUrls = {
  list: "wait-list/",
  create: "wait-list/",
  update: (pk: PK) => `wait-list/${pk}/`,
  check: (pk: PK) => `wait-list/${pk}/check/`,
  archivar: (pk: PK) => `wait-list/${pk}/archivar/`,
  createOrUpdate: `wait-list/create-or-update/`,
};
