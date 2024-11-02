import { mapApiErrors } from "@/utils/errors";
import React from "react";
import { FieldError } from "./types";

export class BaseException extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly stack?: string;
  public readonly data?: any;

  public fieldErrors: FieldError[] = [];
  public toastMessage?: string;
  public allMessages?: string[] = [];
  public allMessagesLikeReact?: React.ReactNode[];
  public firstError?: { attr?: string; code?: string; detail?: string };

  constructor(message: string, data?: any) {
    super(message);
    console.log("DATA: ", data);
    this.name = this.constructor.name;
    this.message = message;
    this.data = data;
    this.firstError = data?.firstError;
    Error.captureStackTrace(this, this.constructor);
  }

  getFieldErrors(): FieldError[] {
    return this.fieldErrors;
  }

  getToastMessage() {
    return this.toastMessage;
  }
}

export class ApiException extends BaseException {
  constructor(message: string, data?: any) {
    super(message, data);
    if (Array.isArray(data?.errors)) {
      this.allMessages = data.errors.map((item) => item["detail"]);
      this.allMessagesLikeReact = mapApiErrors(this.allMessages);
      this.fieldErrors = data.errors.map((item) => ({
        name: item["attr"] || "unknown",
        props: {
          message: item["detail"],
          type: "custom",
        },
      }));
    }
  }
}
