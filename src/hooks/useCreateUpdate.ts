import { CrudActions } from "@/emuns/crudActions";
import { BaseException } from "@/services/service.exceptions";
import { AxiosResponse } from "axios";
import has from "lodash/has";
import React, { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useMutation } from "react-query";
import useToasts from "./useToasts";

interface UseCreateUpdateProps<T> {
  action: CrudActions.CREATE | CrudActions.UPDATE;
  methods: UseFormReturn;
  create?: (variables: T) => Promise<AxiosResponse<T>>;
  update?: (variables: T) => Promise<AxiosResponse<T>>;
  onSuccess?: (data: AxiosResponse<T>) => void;
  onSuccessCreate?: (data: AxiosResponse<T>) => void;
  onSuccessUpdate?: (data: AxiosResponse<T>) => void;
  onError?: (error: any) => void;
  onErrorCreate?: (error: any) => void;
  onErrorUpdate?: (error: any) => void;
}

const useCreateUpdate = <T>({
  action,
  methods,
  create,
  update,
  onSuccess,
  onSuccessCreate,
  onSuccessUpdate,
  onError,
  onErrorCreate,
  onErrorUpdate,
}: UseCreateUpdateProps<T>) => {
  const actionPromise = useMemo(() => {
    if (action === CrudActions.CREATE) {
      return create;
    }
    return update;
  }, [action, create, update]);

  const toasts = useToasts();

  const mutation = useMutation((formData: T) => actionPromise(formData), {
    onError: (error: any) => {
      if (action === CrudActions.CREATE && onErrorCreate) {
        onErrorCreate(error);
      } else if (action === CrudActions.UPDATE && onErrorUpdate) {
        onErrorUpdate(error);
      } else if (onError) {
        onError(error);
      }
    },
    onSuccess: (data: AxiosResponse<T>) => {
      if (action === CrudActions.CREATE && onSuccessCreate) {
        onSuccessCreate(data);
      } else if (action === CrudActions.UPDATE && onSuccessUpdate) {
        onSuccessUpdate(data);
      } else if (onSuccess) {
        onSuccess(data);
      }
    },
  });

  const submitForm = async (data) => {
    try {
      const response = await mutation.mutateAsync(data);
      return response.data;
    } catch (error) {
      if (error instanceof BaseException) {
        const toastMessages = [];
        error.getFieldErrors().forEach((item) => {
          if (has(methods.control._fields, item.name)) {
            methods.setError(item.name, item.props);
          } else if (item.props.message) {
            toastMessages.push(item.props.message);
          }
        });
        if (toastMessages.length > 0) {
          const errorMessages = toastMessages.map((children) => {
            return React.createElement("p", {
              key: children,
              children,
              className: "p-0 m-0 text-justify",
            });
          });
          toasts.addErrorToast(errorMessages);
        } else {
          toasts.addWarningToast("Algo ha salido mal, revisa la información ingresada");
        }
        return;
      }
      toasts.addErrorToast(
        error?.message || "Ha ocurrido un problema al momento de procesar tu petición"
      );
      console.log("ERROR: ", error);
    }
  };

  return {
    ...mutation,
    submitForm,
  };
};

export default useCreateUpdate;
