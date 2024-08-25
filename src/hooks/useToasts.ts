import React from "react";
import toast, { Renderable, Toast, ToastOptions, ValueOrFunction } from "react-hot-toast";

type Message = ValueOrFunction<React.ReactNode | Renderable, Toast>;
type ToastTypeFunction = (content: Message, opts?: ToastOptions) => void;

export interface UseToastsProps {
  addSuccessToast: ToastTypeFunction;
  addErrorToast: ToastTypeFunction;
}

const useToasts = (): UseToastsProps => {
  const addToast = (type: "success" | "error"): ToastTypeFunction => {
    return (content: Message, opts?: ToastOptions) => {
      //@ts-ignore
      toast[type](content, opts);
    };
  };

  return {
    addSuccessToast: addToast("success"),
    addErrorToast: addToast("error"),
  };
};

export default useToasts;
