"use client";

import PageTitle from "@/components/pages/PageTitle";
import PaginatedTable from "@/components/Tables/PaginatedTable";
import usePagination from "@/hooks/usePagination";
import { TagCitaService } from "@/services/citas/tagCita.service";
import { TAG_CITA_URLS } from "@/services/citas/tagCita.urls";
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

  return (
    <div className='grid grid-nogutter'>
      <div className='col-12'>
        <PageTitle>Tags</PageTitle>
      </div>
      <div className='col-12'>
        <PaginatedTable
          {...pagination.tableProps}
          filterDisplay='menu'
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
          />
          <Column className='text-center w-1' header='Editar' rowEditor />
        </PaginatedTable>
      </div>
    </div>
  );
}
