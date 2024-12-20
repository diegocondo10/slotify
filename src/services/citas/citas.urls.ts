import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface CitaUrls extends BaseURLs {
  listByRange: (start: string, end: string) => string;
  detail: (id: PK) => string;
  reagendar: (id: PK) => string;
  pagar: (id: PK) => string;
  cambiarEstado: (pk: PK) => string;
  reporteEstadisticas: (start: string, end: string) => string;
  reporteListStats: (start: string, end: string) => string;
  reporteListStatsXlsx: (start: string, end: string) => string;
  payReport: (start: string, end: string) => string;
  payReportXlsx: (start: string, end: string) => string;
  printList: (search: string) => string;
}

export const CITAS_URLS: CitaUrls = {
  list: "citas/",
  create: "citas/",
  delete: (id: PK) => `citas/${id}/`,
  retrieve: (id: PK) => `citas/${id}/`,
  detail: (id: PK) => `citas/${id}/detail/`,
  update: (id: PK) => `citas/${id}/`,
  listByRange: (start: string, end: string) => `citas/list-by-range/${start}/${end}/`,
  reagendar: (id: PK) => `citas/${id}/reagendar/`,
  pagar: (id: PK) => `citas/${id}/pagar/`,
  cambiarEstado: (pk: PK) => `citas/${pk}/cambiar-estado/`,
  reporteEstadisticas: (start: string, end: string) => `citas/reports/stats/${start}/${end}/`,
  reporteListStats: (start: string, end: string) => `citas/reports/list-stats/${start}/${end}/`,
  reporteListStatsXlsx: (start: string, end: string) =>
    `citas/reports/list-stats-xlsx/${start}/${end}/`,
  payReport: (start: string, end: string) => `citas/reports/pay-stats/${start}/${end}/`,
  payReportXlsx: (start: string, end: string) => `citas/reports/pay-stats-xlsx/${start}/${end}/`,
  printList: (search: string) => `citas/list-as-xlsx/${search}`,
};
