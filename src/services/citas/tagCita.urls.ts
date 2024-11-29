import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface TagCitaUrls extends BaseURLs {
  listAsLabelValue: string;
  listAsLabelValueAll: string;
}

export const TAG_CITA_URLS: TagCitaUrls = {
  list: "tags/",
  listAsLabelValue: "tags/label-value/",
  listAsLabelValueAll: "tags/label-value-all/",
  create: "tags/",
  update: (pk: PK) => `tags/${pk}/`,
  delete: (pk: PK) => `tags/${pk}/`,
  retrieve: (pk: PK) => `tags/${pk}/`,
};
