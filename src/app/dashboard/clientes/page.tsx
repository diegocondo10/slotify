"use client";

import Button from "@/components/Buttons/Button";
import PageTitle from "@/components/pages/PageTitle";
import ActionColumn from "@/components/Tables/ActionColumn";
import PaginatedTable from "@/components/Tables/PaginatedTable";
import usePagination from "@/hooks/usePagination";
import { CLIENTES_URLS } from "@/services/clientes/clientes.urls";
import { lazyPush } from "@/utils/router";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";

export default function ClientesPage() {
  const pagination = usePagination({
    key: ["clientes-list", CLIENTES_URLS.list],
    uri: CLIENTES_URLS.list,
  });

  const router = useRouter();

  return (
    <div className='grid grid-nogutter'>
      <div className='col-12'>
        <PageTitle>Clientes</PageTitle>
      </div>
      <div className='col-12'>
        <PaginatedTable
          {...pagination.tableProps}
          header={
            <Toolbar
              end={
                <Button label='Agregar' icon={PrimeIcons.PLUS} href='/dashboard/clientes/agregar' />
              }
            />
          }>
          <Column header='Nombres' style={{ minWidth: "15rem" }} field='fullName' />

          <Column
            header='Tipo de identificación'
            style={{ minWidth: "5rem" }}
            field='tipoIdentificacion'
          />
          <Column header='Identificación' field='identificacion' />
          <Column
            header='Fecha de nacimiento'
            style={{ minWidth: "10rem" }}
            field='fechaNacimiento'
          />
          <Column header='Telefono' field='telefono' />
          <Column header='Correo' field='email' />
          {ActionColumn((rowData) => [
            {
              label: "Editar",
              command: lazyPush(router, `/dashboard/clientes/editar?id=${rowData.id}`),
            },
          ])}
        </PaginatedTable>
      </div>
    </div>
  );
}
