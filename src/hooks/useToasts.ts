import { ReactNode } from 'react';
import {
  AddToast,
  AppearanceTypes,
  Options,
  RemoveAllToasts,
  RemoveToast,
  UpdateToast,
  useToasts as baseHook,
} from 'react-toast-notifications';

type CallbackType = (id: string) => void;

type ToastType = (content: ReactNode, extraProps?: Options, callback?: CallbackType) => void;

export interface UseToastsProps {
  addSuccessToast: ToastType;
  addErrorToast: ToastType;
  addWarningToast: ToastType;
  addInfoToast: ToastType;
  addToast: AddToast;
  removeToast: RemoveToast;
  removeAllToasts: RemoveAllToasts;
  toastStack: Array<{
    content: ReactNode;
    id: string;
    appearance: AppearanceTypes;
  }>;
  updateToast: UpdateToast;
}

export interface BaseToastProps {
  content: ReactNode;
  extraProps?: Options;
  callback?: CallbackType;
}

const ToastTypes: Array<AppearanceTypes> = ['error', 'info', 'success', 'warning'];

const useToasts = (): UseToastsProps => {
  const { addToast, ...rest } = baseHook();

  const baseToast = ({ content, extraProps, callback }: BaseToastProps, appearance: AppearanceTypes): void => {
    addToast(content, { ...extraProps, appearance }, callback);
  };

  const buildToast = () => {
    const entries = ToastTypes.map((toastType) => {
      const capitalizedToastType = toastType.charAt(0).toUpperCase() + toastType.slice(1);
      return [
        `add${capitalizedToastType}Toast`,
        (content: ReactNode, extraProps?: Options, callback?: CallbackType) => {
          baseToast({ content, extraProps, callback }, toastType);
        },
      ];
    });

    return Object.fromEntries(entries);
  };

  return {
    ...buildToast(),
    ...rest,
  } as UseToastsProps;
};

export default useToasts;
