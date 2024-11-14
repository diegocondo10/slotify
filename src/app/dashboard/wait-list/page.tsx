"use client";

import Button from "@/components/Buttons/Button";
import DeleteRecordConfirm from "@/components/DeleteRecordConfirm";
import RecordDetail from "@/components/DeleteRecordConfirm/RecordDetail";
import useDeleteRecordConfirm from "@/components/DeleteRecordConfirm/useDeleteRecordConfirm";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import HiddenField from "@/components/Forms/HiddenField";
import TextArea from "@/components/Forms/TextArea";
import TextInput from "@/components/Forms/TextInput";
import PageTitle from "@/components/pages/PageTitle";
import useDeleteItem from "@/hooks/useDeleteItem";
import { WaitListService } from "@/services/wait-list/wait-list.service";

import { createClickHandler } from "@/utils/events";
import { PrimeIcons } from "primereact/api";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

const waitListService = new WaitListService();

const WaitListPage = () => {
  const methods = useForm({
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const queryList = useQuery(["wait-list"], () => waitListService.list(), {});

  const handleCheck = (rowData) => async (e) => {
    setIsLoading(true);
    await waitListService.check(rowData.id, e.checked);
    await queryList.refetch();
    setIsLoading(false);
  };

  const handleOnDoubleClickRow = (event: DataTableRowClickEvent) => {
    setIsVisible(true);
    console.log(event.data);
    methods.reset(event.data);
  };

  const handleRowClick = createClickHandler(handleOnDoubleClickRow);

  const handleOnSave = async (data) => {
    setIsLoading(true);
    await waitListService.createOrUpdate(data);
    toast.success(`Se ha guardado correctamente: ${data.titulo}`);
    setIsLoading(false);
    methods.reset({});
    setIsVisible(false);
    queryList.refetch();
  };

  const handleOnHide = () => {
    methods.reset({});
    setIsVisible(false);
  };

  const handleOnAdd = () => {
    setIsVisible(true);
    methods.reset({});
  };

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();
  const deleteMutation = useDeleteItem({
    mutationFn: (record) => waitListService.archivar(record.id),
  });

  return (
    <div className='grid grid-nogutter'>
      <div className='col-12'>
        <PageTitle>Lista de espera</PageTitle>
      </div>

      <DeleteRecordConfirm
        ref={deleteRecordRef}
        messageDetail={(record) => (
          <RecordDetail
            title='Estas seguro/a de archivar este registro?'
            items={[
              ["Título", record.titulo],
              ["Descripción", record.descripcion],
              ["Check", record.isChecked ? "SI" : "NO"],
            ]}
          />
        )}
        onAccept={async (record) => {
          await deleteMutation.deleteRecord(record);
          await queryList.refetch();
        }}
      />

      <div className='col-12 mb-5'>
        <DataTable
          loading={queryList.isFetching || isLoading}
          value={queryList?.data?.data || []}
          size='small'
          rowHover
          stripedRows
          showGridlines
          onRowClick={handleRowClick}
          header={
            <Toolbar
              start={<Button label='Agregar' onClick={handleOnAdd} />}
              end={<Button icon={PrimeIcons.REFRESH} onClick={() => queryList.refetch()} />}
            />
          }>
          <Column
            header='#'
            className='text-center font-bold'
            body={(rowData, options) => options.rowIndex + 1}
          />

          <Column
            header='Check'
            field='isChecked'
            className='text-center'
            body={(rowData) => {
              return <Checkbox checked={rowData?.isChecked} onChange={handleCheck(rowData)} />;
            }}
          />

          <Column header='Título' field='titulo' />

          <Column header='Descripción' field='descripcion' />

          <Column
            header={<i className={PrimeIcons.TRASH} />}
            body={(rowData) => (
              <Button
                variant='danger'
                icon={PrimeIcons.TRASH}
                size='small'
                onClick={deleteEvent(rowData)}
              />
            )}
          />

          {/* <Column header='Ultima actualizacion' field='updatedAt' /> */}
        </DataTable>
      </div>

      <Dialog
        onHide={handleOnHide}
        visible={isVisible}
        header='Registro'
        draggable={false}
        breakpoints={{
          "960px": "75vw",
          "641px": "90vw",
        }}
        dismissableMask>
        <FormProvider {...methods}>
          <div className='grid grid-nogutter w-full p-4'>
            <HiddenField name='id' defaultValue={null} />
            <div className='field col-12'>
              <FormFieldRender
                name='titulo'
                label='Título'
                render={({ name }) => (
                  <TextInput
                    block
                    controller={{
                      name,
                      rules: {
                        maxLength: {
                          value: 255,
                          message: "El límite es de 255 caracteres",
                        },
                        validate: (value?: string) => {
                          if (!value || value?.trim() === "") {
                            return "Este campo es obligatorio";
                          }
                        },
                      },
                    }}
                  />
                )}
              />
            </div>
            <div className='field col-12'>
              <FormFieldRender
                name='descripcion'
                label='Descripción'
                render={({ name }) => (
                  <TextArea
                    rows={10}
                    block
                    controller={{
                      name,
                      rules: {
                        validate: (value?: string) => {
                          if (!value || value?.trim() === "") {
                            return "Este campo es obligatorio";
                          }
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div className='col-12 grid grid-nogutter justify-content-between'>
              <div className='col-5'>
                <Button
                  label='Cancelar'
                  loading={isLoading}
                  block
                  variant='danger'
                  onClick={handleOnHide}
                />
              </div>
              <div className='col-5'>
                <Button
                  label='Guardar'
                  loading={isLoading}
                  block
                  onClick={methods.handleSubmit(handleOnSave)}
                />
              </div>
            </div>
          </div>
        </FormProvider>
      </Dialog>
    </div>
  );
};

export default WaitListPage;
