import { BaseException } from "@/services/exceptions";
import { MutationFunction, useMutation } from "react-query";
import useToasts from "./useToasts";

interface UseDeleteItemProps<TData, TVariables, TContext = unknown> {
  mutationFn: MutationFunction<TData, TVariables>;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<unknown> | void;
}

const useDeleteItem = ({ mutationFn, onSuccess }: UseDeleteItemProps<any, any>) => {
  const mutation = useMutation({
    mutationFn,
    onSuccess,
  });

  const toast = useToasts();

  const deleteRecord = async <T = any>(record: T) => {
    try {
      await mutation.mutateAsync(record);
    } catch (error) {
      if (error instanceof BaseException) {
        const errorMessages = error.allMessagesLikeReact;
        if (errorMessages.length > 0) {
          toast.addErrorToast(errorMessages);
        }
      }
    }
  };

  return {
    ...mutation,
    deleteRecord,
  };
};

export default useDeleteItem;
