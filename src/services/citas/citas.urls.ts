import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface CitaUrls extends BaseURLs {
  listByRange: (start: string, end: string) => string;
  reagendar: (id: PK) => string;
  pagar: (id: PK) => string;
  cambiarEstado: (pk: PK) => string;
}

export const CITAS_URLS: CitaUrls = {
  list: "citas/",
  create: "citas/",
  delete: (id: PK) => `citas/${id}/`,
  retrieve: (id: PK) => `citas/${id}/`,
  update: (id: PK) => `citas/${id}/`,
  listByRange: (start: string, end: string) => `citas/list-by-range/${start}/${end}/`,
  reagendar: (id: PK) => `citas/${id}/reagendar/`,
  pagar: (id: PK) => `citas/${id}/pagar/`,
  cambiarEstado: (pk: PK) => `citas/${pk}/cambiar-estado/`,
};
