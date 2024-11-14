"use client";

import Button from "@/components/Buttons/Button";
import PageTitle from "@/components/pages/PageTitle";
import { WaitListService } from "@/services/wait-list/wait-list.service";
import { PrimeIcons } from "primereact/api";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { useState } from "react";
import { useQuery } from "react-query";

const waitListService = new WaitListService();

const WaitListPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(true);

  const queryList = useQuery(["wait-list"], () => waitListService.list(), {});

  const handleCheck = (rowData) => async (e) => {
    setIsLoading(true);
    await waitListService.check(rowData.id, e.checked);
    await queryList.refetch();
    setIsLoading(false);
  };

  return (
    <div className='grid grid-nogutter'>
      <div className='col-12'>
        <PageTitle>Lista de espera</PageTitle>
      </div>
      <div className='col-12'>
        <DataTable
          loading={queryList.isFetching || isLoading}
          value={queryList?.data?.data || []}
          size='small'
          rowHover
          stripedRows
          showGridlines
          header={
            <Toolbar
              start={<Button label='Agregar' onClick={() => setIsVisible(true)} />}
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
          {/* <Column header='Ultima actualizacion' field='updatedAt' /> */}
        </DataTable>
      </div>

      <Dialog
        onHide={() => setIsVisible(false)}
        visible={isVisible}
        header='Registro'
        draggable={false}
        breakpoints={{
          "960px": "75vw",
          "641px": "90vw",
        }}
        dismissableMask></Dialog>
    </div>
  );
};

export default WaitListPage;
