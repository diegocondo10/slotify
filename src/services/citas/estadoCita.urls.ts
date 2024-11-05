import { BaseURLs } from "../types";

export interface EstadoCitaUrls extends BaseURLs {
  listAsLabelValue: string;
}

export const ESTADO_CITA_URLS: EstadoCitaUrls = {
  listAsLabelValue: "citas/estados/label-value/?version=3",
};
