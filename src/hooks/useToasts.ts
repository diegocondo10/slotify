import React from "react";
import toast, { Renderable, Toast, ToastOptions, ValueOrFunction } from "react-hot-toast";

type Message = ValueOrFunction<React.ReactNode | Renderable, Toast>;
type ToastTypeFunction = (content: Message, opts?: ToastOptions) => void;

export interface UseToastsProps {
  addSuccessToast: ToastTypeFunction;
  addErrorToast: ToastTypeFunction;
  jsxToast: (content: (t?: Toast) => any, opts?: ToastOptions) => any;
  dismiss(toastId?: string): void;
  remove(toastId?: string): void;
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
    jsxToast: (content, options) => toast((t) => content(t), options),
    dismiss: toast.dismiss,
    remove: toast.remove,
  };
};

export default useToasts;
