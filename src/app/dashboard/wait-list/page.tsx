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
import { keyBy } from "lodash";
import { normalizeText } from "normalize-text";
import { PrimeIcons } from "primereact/api";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

const waitListService = new WaitListService();

const PRIORIDADES = [
  {
    label: 1,
    style: {
      backgroundColor: "#d11223",
      color: "#ffffff",
    },
  },
  {
    label: 2,
    style: {
      backgroundColor: "#f3e60a",
      color: "#000000",
    },
  },
  {
    label: 3,
    style: {
      backgroundColor: "#34f30a",
      color: "#000000",
    },
  },
];

const PRIORIDADES_INDEX = keyBy(PRIORIDADES, "label");

const WaitListPage = () => {
  console.log(PRIORIDADES_INDEX);
  const methods = useForm({
    mode: "onChange",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [filter, setFilter] = useState("");

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

  const data = useMemo(() => {
    const normalizedFilter = normalizeText(filter);
    return (queryList?.data?.data || []).filter(
      (item) =>
        normalizeText(item.titulo).includes(normalizedFilter) ||
        normalizeText(item.descripcion).includes(normalizedFilter)
    );
  }, [filter, queryList?.data?.data]);

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
          value={data}
          size='small'
          rowHover
          stripedRows
          showGridlines
          onRowClick={handleRowClick}
          header={
            <div className='flex flex-row justify-between items-center gap-5 my-2'>
              <div className='flex items-center'>
                <Button
                  label='Agregar'
                  onClick={handleOnAdd}
                  disabled={queryList.isFetching || isLoading}
                />
              </div>
              <div className='flex-1 px-2'>
                <InputText
                  className='w-full'
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                  type='search'
                  disabled={queryList.isFetching || isLoading}
                />
              </div>
              <div className='flex items-center'>
                <Button
                  icon={PrimeIcons.REFRESH}
                  onClick={() => queryList.refetch()}
                  disabled={queryList.isFetching || isLoading}
                />
              </div>
            </div>
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
              return (
                <Checkbox
                  checked={rowData?.isChecked}
                  onChange={handleCheck(rowData)}
                  disabled={queryList.isFetching || isLoading}
                />
              );
            }}
          />

          <Column
            header='Prioridad'
            className='text-center'
            bodyClassName='m-0'
            body={(rowData) => (
              <div
                className='mx-auto py-2 font-bold'
                style={{
                  ...PRIORIDADES_INDEX[rowData.prioridad].style,
                  width: "3rem",
                }}>
                {rowData.prioridad}
              </div>
            )}
          />
          <Column header='Nombre' field='titulo' />

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

            <div className='field col-12'>
              <Controller
                name='prioridad'
                defaultValue='1'
                render={({ field: { value, onChange } }) => (
                  <FormFieldRender
                    name='prioridad'
                    label={
                      <div className='flex flex-row my-1'>
                        <div className=' py-1'>Prioridad: </div>
                        {value && (
                          <Tag
                            className='ml-2 px-2 text-center border-1 border-gray-500'
                            style={PRIORIDADES_INDEX[value].style}>
                            {PRIORIDADES_INDEX[value].label}
                          </Tag>
                        )}
                      </div>
                    }
                    render={() => (
                      <div className='w-full'>
                        {PRIORIDADES.map((prioridad) => (
                          <button
                            type='button'
                            className='text-center border-1 border-gray-500 border-round text-center mx-1 font-bold cursor-pointer'
                            style={{ ...prioridad.style, width: "3rem", height: "3rem" }}
                            onClick={() => onChange(prioridad.label)}>
                            {prioridad.label}
                          </button>
                        ))}
                      </div>
                    )}
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
