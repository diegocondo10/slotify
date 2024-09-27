import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface NotasUrls extends BaseURLs {
  oneByDate: (fecha: string) => string;
  createOrUpdate: (fecha: string) => string;
  listByRange: (inicio: string, fin: string) => string;
}

export const NOTAS_URLS: NotasUrls = {
  list: "notas/",
  create: "notas/",
  delete: (id: PK) => `notas/${id}/`,
  retrieve: (id: PK) => `notas/${id}/`,
  update: (id: PK) => `notas/${id}/`,
  oneByDate: (fecha: string) => `notas/one-by-date/${fecha}/`,
  createOrUpdate: (fecha: string) => `notas/create-or-update/${fecha}/`,
  listByRange: (inicio: string, fin: string) => `notas/list-by-range/${inicio}/${fin}/`,
};
