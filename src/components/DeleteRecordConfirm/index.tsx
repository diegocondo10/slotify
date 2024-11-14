import { confirmDialog, ConfirmDialog, ConfirmDialogOptions } from "primereact/confirmdialog";
import React, { forwardRef, useImperativeHandle } from "react";
import Button from "../Buttons/Button";

interface DeleteRecordConfirmProps<TVariables> {
  onAccept: (record: TVariables) => Promise<void>;
  messageDetail: (record: TVariables) => React.ReactNode;
}

export interface DeleteRecordConfirmHandle<TData extends any = any, TVariables extends any = any> {
  deleteRecord: (record: any) => () => void;
}

const DeleteRecordConfirm = forwardRef<
  DeleteRecordConfirmHandle<any, any>,
  DeleteRecordConfirmProps<any>
>(({ onAccept, messageDetail }, ref) => {
  const deleteRecord = (record: any) => () => {
    confirmDialog({
      draggable: false,
      message: messageDetail(record),
      contentClassName: "w-full",
      header: "Confirmación",
      footer: (options: ConfirmDialogOptions) => {
        return (
          <div className='grid grid-nogutter justify-content-around'>
            <div className='col-12 sm:col-5 my-1'>
              <Button label='SI' outlined variant='danger' block onClick={options.accept} />
            </div>
            <div className='col-12 sm:col-5 my-1'>
              <Button label='NO' outlined block onClick={options.reject} />
            </div>
          </div>
        );
      },
      style: {
        width: "100%",
        maxWidth: "35rem",
      },
      accept: async () => {
        await onAccept(record);
      },
    });
  };

  useImperativeHandle(ref, () => ({
    deleteRecord,
  }));

  return <ConfirmDialog className='delete__confirm__dialog' dismissableMask />;
});

DeleteRecordConfirm.displayName = "DeleteRecordConfirm";

export default DeleteRecordConfirm;
