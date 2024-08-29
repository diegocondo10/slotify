import { PK } from "@/types/api";
import { BaseURLs } from "../types";

export interface ClientesUrls extends BaseURLs {
  listAsLabelValue: string;
  createBasic: string;
}

export const CLIENTES_URLS: ClientesUrls = {
  list: "clientes/",
  create: "clientes/",
  delete: (id: PK) => `clientes/${id}/`,
  retrieve: (id: PK) => `clientes/${id}/`,
  update: (id: PK) => `clientes/${id}/`,
  listAsLabelValue: "clientes/label-value/",
  createBasic: "clientes/create-basic/",
};
