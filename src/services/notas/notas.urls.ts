import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface NotasUrls extends BaseURLs {
  listByDate: (fecha: string) => string;
}

export const NOTAS_URLS: NotasUrls = {
  list: "notas/",
  create: "notas/",
  delete: (id: PK) => `notas/${id}/`,
  retrieve: (id: PK) => `notas/${id}/`,
  update: (id: PK) => `notas/${id}/`,
  listByDate: (fecha: String) => `notas/list-by-date/${fecha}/`,
};
