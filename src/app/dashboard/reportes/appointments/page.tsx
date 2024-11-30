"use client";
import DetailPopUp, { DetailPopUpHandle } from "@/components/Appointmets/DetailPopUp";
import Button from "@/components/Buttons/Button";
import PageTitle from "@/components/pages/PageTitle";
import MultiSelectFilter from "@/components/Tables/filters/MultiSelectFilter";
import PaginatedTable from "@/components/Tables/PaginatedTable";
import usePagination from "@/hooks/usePagination";
import { CitaService } from "@/services/citas/citas.service";
import { CITAS_URLS } from "@/services/citas/citas.urls";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { TagCitaService } from "@/services/citas/tagCita.service";
import { toBackDate, toFrontDate } from "@/utils/date";
import { createClickHandler } from "@/utils/events";
import { downloadReport } from "@/utils/file";
import { FilterMatchMode, PrimeIcons } from "primereact/api";
import { Column } from "primereact/column";
import { DataTableRowClickEvent } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { useRef } from "react";
import DatePicker from "react-datepicker";
import { useQuery } from "react-query";

const tagService = new TagCitaService();
const estadoService = new EstadoCitaService();

const AppointmentsReportPage = () => {
  const pagination = usePagination({
    uri: CITAS_URLS.list,
    key: ["citas"],
    defaultFilters: {
      tag: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
      estado: {
        value: [],
        matchMode: FilterMatchMode.IN,
      },
      fecha_after: {
        value: null,
        matchMode: FilterMatchMode.EQUALS,
      },
      fecha_before: {
        value: null,
        matchMode: FilterMatchMode.EQUALS,
      },
      pagada: {
        value: null,
        matchMode: FilterMatchMode.IN,
      },
    },
  });

  const queryTags = useQuery(["tags_list_label_value"], () => tagService.listAsLabelValueAll());
  const queryEstados = useQuery(["estados_citas"], () => estadoService.listAsLabelValue(), {});

  const detaulPopupRef = useRef<DetailPopUpHandle>(null);

  const handleOnDoubleClickRow = (event: DataTableRowClickEvent) => {
    console.log(event);
    detaulPopupRef.current.toggle(event.data.id, event.originalEvent, event.originalEvent.target);
  };

  const handleRowClick = createClickHandler(handleOnDoubleClickRow);

  return (
    <div className='grid grid-nogutter justify-content-center'>
      <DetailPopUp refetch={pagination.refetch} ref={detaulPopupRef} />
      <div className='col-12'>
        <PageTitle>Citas</PageTitle>
      </div>

      <div className='col-12'>
        <PaginatedTable
          {...pagination.tableProps}
          onRowClick={handleRowClick}
          paginatorLeft={
            <Button
              icon={PrimeIcons.PRINT}
              onClick={() => {
                downloadReport(new CitaService().printList(pagination.searchUrl));
              }}
            />
          }>
          <Column
            style={{ minWidth: "20rem" }}
            header='Nombre'
            field='titulo'
            showFilterMenu={false}
            showClearButton={false}
            filter
            filterField='tag'
            className='cursor-pointer'
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                showClear
                options={queryTags?.data || []}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
            body={(rowData) => <p className='m-0'>{rowData.titulo}</p>}
          />
          <Column
            className='text-center w-10rem cursor-pointer'
            header='Fecha'
            field='fecha'
            showFilterMenu={false}
            filter
            filterField='fecha'
            filterElement={(filterProps) => {
              //@ts-ignore
              const start = pagination.filters?.fecha_after?.value;
              const startDate = start ? toFrontDate(start) : start;

              //@ts-ignore
              const end = pagination.filters?.fecha_before?.value;
              const endDate = end ? toFrontDate(end) : null;

              return (
                <DatePicker
                  wrapperClassName='w-full'
                  className='w-full p-inputtext p-component text-center'
                  selectsRange
                  dateFormat='dd/MMM/yyyy'
                  placeholderText='Seleccione'
                  onChange={(value) => {
                    const start = value?.[0] || null;
                    const end = value?.[1] || null;
                    pagination.setFilters((old) => ({
                      ...old,
                      fecha_after: {
                        value: start ? toBackDate(start) : null,
                        matchMode: null,
                      },
                      fecha_before: {
                        value: end ? toBackDate(end) : null,
                        matchMode: null,
                      },
                    }));
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  // monthsShown={2}
                />
              );
            }}
            showClearButton={false}
            body={(rowData) => <p className='m-0 p-0 w-10rem mx-auto'>{rowData.fecha}</p>}
          />
          <Column
            className='text-center w-10rem cursor-pointer'
            header='Pagada'
            body={(rowData) => <p className='p-0 m-0 mx-auto'>{rowData?.isPagada ? "SI" : "NO"}</p>}
            showFilterMenu={false}
            showClearButton={false}
            filter
            filterField='pagada'
            filterElement={(filterProps) => (
              <Dropdown
                options={["SI", "NO"]}
                showClear
                value={filterProps.value}
                onChange={(e) => filterProps.filterApplyCallback(e.value)}
                placeholder='Seleccione'
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
          {/* <Column className='text-center' header='Duración' field='duracionHoras' /> */}
          <Column
            header='Estado'
            className='text-center'
            style={{ minWidth: "11rem", maxWidth: "15rem" }}
            body={(rowData) => (
              <Tag
                role='button'
                className='py-2 w-full m-0'
                style={{
                  backgroundColor: rowData.estado.styles.backgroundColor,
                  color: rowData.estado.styles.color,
                }}>
                {rowData.estado.label}
              </Tag>
            )}
            showFilterMenu={false}
            showClearButton={false}
            filter
            filterField='estado'
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                optionValue='value.id'
                showClear
                options={queryEstados?.data || []}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
        </PaginatedTable>
      </div>
    </div>
  );
};

export default AppointmentsReportPage;
