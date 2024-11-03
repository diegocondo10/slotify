"use client";

import Button from "@/components/Buttons/Button";
import DeleteRecordConfirm from "@/components/DeleteRecordConfirm";
import RecordDetail from "@/components/DeleteRecordConfirm/RecordDetail";
import useDeleteRecordConfirm from "@/components/DeleteRecordConfirm/useDeleteRecordConfirm";
import PageTitle from "@/components/pages/PageTitle";
import PaginatedTable from "@/components/Tables/PaginatedTable";
import useDeleteItem from "@/hooks/useDeleteItem";
import usePagination from "@/hooks/usePagination";
import { TagCitaService } from "@/services/citas/tagCita.service";
import { TAG_CITA_URLS } from "@/services/citas/tagCita.urls";
import { PrimeIcons } from "primereact/api";
import { Column } from "primereact/column";
import { DataTableRowEditCompleteEvent } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

const tagService = new TagCitaService();

export default function ClientesPage() {
  const pagination = usePagination({
    key: ["tags-list"],
    uri: TAG_CITA_URLS.list,
    defaultFilters: {
      titulo: {
        value: null,
        matchMode: null,
      },
    },
  });

  const updateMutation = useMutation(
    (event: DataTableRowEditCompleteEvent) =>
      tagService.update(event.newData.id, { titulo: event.newData.titulo }),
    {
      onError: () => {
        toast.error(
          "Ha ocurrido un problema al momento de guardar la información, por favor intenta nuevamente"
        );
      },
    }
  );

  const isLoading = pagination.isFetching || updateMutation.isLoading;

  const onRowEditComplete = async (event: DataTableRowEditCompleteEvent) => {
    await updateMutation.mutateAsync(event);
    pagination.refetch();
  };

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();
  const deleteMutation = useDeleteItem({
    mutationFn: (tag) => tagService.delete(tag.id),
  });
  return (
    <div className='grid grid-nogutter'>
      <div className='col-12'>
        <PageTitle>Tags</PageTitle>
      </div>
      <DeleteRecordConfirm
        ref={deleteRecordRef}
        messageDetail={(record) => (
          <RecordDetail
            title='Estas seguro/a de eliminar esta etiqueta?'
            items={[["Título", record.titulo]]}
          />
        )}
        onAccept={async (record) => {
          await deleteMutation.deleteRecord(record);
          await pagination.refetch();
        }}
      />
      <div className='col-12'>
        <PaginatedTable
          {...pagination.tableProps}
          editMode='row'
          onRowEditComplete={onRowEditComplete}
          loading={isLoading}>
          <Column
            header='Título'
            style={{ minWidth: "15rem" }}
            field='titulo'
            editor={(options) => (
              <InputText
                className='p-inputtext-sm w-full'
                value={options.value}
                required
                minLength={3}
                onChange={(e) => options.editorCallback(e.target.value)}
              />
            )}
            filter
            filterField='titulo'
            showFilterMenu={false}
            showClearButton={false}
            filterElement={(filterProps) => (
              <InputText
                value={filterProps.value}
                type='search'
                onChange={(e) => filterProps.filterApplyCallback(e.target.value)}
              />
            )}
          />
          <Column className='text-center w-1' header='Editar' rowEditor />
          <Column
            className='text-center w-1'
            header='Eliminar'
            body={(rowData) => (
              <Button
                icon={PrimeIcons.TRASH}
                sm
                text
                outlined={false}
                variant='danger'
                onClick={deleteEvent(rowData)}
              />
            )}
          />
        </PaginatedTable>
      </div>
    </div>
  );
}
