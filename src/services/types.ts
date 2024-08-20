import { PK } from "@/types/api";
import { ErrorOption } from "react-hook-form";

export interface CreateServiceInterface {
  create: () => {};
}

export interface ResponseServiceInterface<TData> {
  data: TData;
  status: number;
}

export interface FieldError {
  name: string;
  props: ErrorOption;
}

export interface BaseURLs {
  list?: string;
  create?: string;
  update?: (id: PK) => string;
  delete?: (id: PK) => string;
  retrieve?: (id: PK) => string;
}

export interface InstanceServiceProps {
  token?: string;
}
