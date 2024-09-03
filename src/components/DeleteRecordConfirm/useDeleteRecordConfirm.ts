import { PrimeIcons } from "primereact/api";
import { useRef } from "react";
import { DeleteRecordConfirmHandle } from ".";

const useDeleteRecordConfirm = () => {
  const deleteRecordRef = useRef<DeleteRecordConfirmHandle>(null);
  return {
    deleteRecordRef,
    deleteItemCommand: (rowData: any, label = "Eliminar", icon = PrimeIcons.TRASH) => {
      return {
        label,
        icon,
        command: deleteRecordRef.current?.deleteRecord(rowData),
      };
    },
    deleteEvent: (rowData: any) => {
      return deleteRecordRef.current?.deleteRecord(rowData);
    },
  };
};

export default useDeleteRecordConfirm;
