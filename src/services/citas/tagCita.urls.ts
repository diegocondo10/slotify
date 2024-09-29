import { BaseURLs } from "../types";

export interface TagCitaUrls extends BaseURLs {
  listAsLabelValue: string;
}

export const TAG_CITA_URLS: TagCitaUrls = {
  listAsLabelValue: "citas/tags/label-value/",
  create: "citas/tags/",
};
