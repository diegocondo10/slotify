"use client";
import PageTitle from "@/components/pages/PageTitle";
import MultiSelectFilter from "@/components/Tables/filters/MultiSelectFilter";
import PaginatedTable from "@/components/Tables/PaginatedTable";
import usePagination from "@/hooks/usePagination";
import { CITAS_URLS } from "@/services/citas/citas.urls";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { TagCitaService } from "@/services/citas/tagCita.service";
import { toBackDate, toFrontDate } from "@/utils/date";
import { simulateTouch } from "@/utils/events";
import { FilterMatchMode } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
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
        value: "",
        matchMode: FilterMatchMode.IN,
      },
    },
  });

  const queryTags = useQuery(["tags_list_label_value"], () => tagService.listAsLabelValue());
  const queryEstados = useQuery(["estados_citas"], () => estadoService.listAsLabelValue(), {});
  return (
    <div className='grid grid-nogutter justify-content-center'>
      <div className='col-12'>
        <PageTitle>Citas</PageTitle>
      </div>

      <div className='col-12'>
        <PaginatedTable {...pagination.tableProps}>
          <Column
            header='Nombre'
            field='titulo'
            showFilterMenu={false}
            filter
            filterField='tag'
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                options={queryTags?.data || []}
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
          <Column
            className='text-center'
            header='Fecha'
            field='fecha'
            showFilterMenu={false}
            filter
            filterField='fecha'
            filterElement={(filterProps) => {
              const value = [];
              //@ts-ignore
              const startDate = pagination.filters?.fecha_after?.value;
              if (startDate) {
                value.push(toFrontDate(startDate));
              }
              //@ts-ignore
              const endDate = pagination.filters?.fecha_before?.value;
              if (endDate) {
                value.push(toFrontDate(endDate));
              }
              return (
                <Calendar
                  placeholder='Seleccione'
                  selectionMode='range'
                  value={value}
                  readOnlyInput
                  showButtonBar
                  onChange={(e) => {
                    const value = e.value;
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
                />
              );
            }}
          />
          <Column
            className='text-center'
            header='Pagada'
            body={(rowData) => (rowData?.isPagada ? "SI" : "NO")}
            showFilterMenu={false}
            filter
            filterField='pagada'
            filterElement={(filterProps) => (
              <Dropdown
                options={["SI", "NO"]}
                value={filterProps.value}
                onChange={(e) => filterProps.filterApplyCallback(e.value)}
                placeholder='Seleccione'
                loading={pagination.isQueryLoading}
                disabled={pagination.isQueryLoading}
              />
            )}
          />
          <Column className='text-center' header='Duración' field='duracionHoras' />
          <Column
            header='Estado'
            body={(rowData) => (
              <div>
                <Tag
                  role='button'
                  className='py-2 w-full m-0'
                  style={{
                    backgroundColor: rowData.estado.styles.backgroundColor,
                    color: rowData.estado.styles.color,
                  }}>
                  {rowData.estado.label}
                </Tag>
              </div>
            )}
            showFilterMenu={false}
            filter
            filterField='estado'
            filterElement={(filterProps) => (
              <MultiSelectFilter
                filterProps={filterProps}
                optionValue='value.id'
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
