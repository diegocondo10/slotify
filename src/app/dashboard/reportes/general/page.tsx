"use client";
import Button from "@/components/Buttons/Button";
import PageTitle from "@/components/pages/PageTitle";
import useRouteState from "@/hooks/useRouteState";
import { CitaService } from "@/services/citas/citas.service";
import { getTextColorForBackground } from "@/utils/color";
import { downloadReport } from "@/utils/file";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { endOfMonth, startOfMonth } from "date-fns";
import { map, sumBy } from "lodash";
import { PrimeIcons } from "primereact/api";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import DateRange from "../components/DateRange";

const citaService = new CitaService();

const ReporteGeneralPage = () => {
  const { routeState, setRouteState } = useRouteState<{ start: Date; end: Date }>({
    defaultValues: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  const startDate = routeState?.start;

  const endDate = routeState?.end;

  const [data, setData] = useState({});

  const queryReporte = useQuery(
    ["reporte-stats", startDate, endDate],
    () => citaService.reporteStats(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
      onSuccess: (response) => {
        setData({
          labels: map(response, "label"),
          datasets: [
            {
              data: map(response, "cantidad"),
              backgroundColor: map(response, "backgroundColor"),
              hoverBackgroundColor: map(response, "backgroundColor"),
              hoverOffset: 4,
            },
          ],
        });
      },
    }
  );

  const queryReporteList = useQuery(
    ["reporte-lists-stats", startDate, endDate],
    () => citaService.reporteListStats(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
    }
  );

  const onChange = (dates) => {
    const [start, end] = dates;
    setRouteState({ start, end });
  };

  const [selectedEstado, setSelectedEstado] = useState(null);

  const citas = useMemo(() => {
    const list = queryReporteList?.data?.list || [];
    if (selectedEstado) {
      return list.filter((item) => item.estado === selectedEstado);
    }
    return list;
  }, [queryReporteList?.data?.list, selectedEstado]);

  const valueDataTable = useMemo(() => {
    if (queryReporte?.data) {
      const value = queryReporte?.data;
      value.push({
        backgroundColor: "#000000",
        color: "#ffffff",
        label: "Total",
        cantidad: sumBy(value, "cantidad"),
      });

      return value;
    }
    return [];
  }, [queryReporte?.data]);

  const chartMemo = useMemo(
    () => (
      <Chart
        type='pie'
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          hover: {
            mode: "nearest",
            animationDuration: 400,
            intersect: true,
          },
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            },
            datalabels: {
              color: (context) => {
                const dataset = context.chart.data.datasets[0];
                const backgroundColor = dataset.backgroundColor[context.dataIndex];
                return getTextColorForBackground(backgroundColor);
              },
              anchor: "center",
              align: "center",
              font: {
                size: 14, // Tamaño del texto ajustado según tus necesidades
                weight: "semi-bold",
              },
              formatter: (value, ctx) => {
                const dataset = ctx.chart.data.datasets[0];
                const total = dataset.data.reduce((acc, cur) => acc + cur, 0);
                const percentage = ((value / total) * 100).toFixed(2) + "%";
                return percentage;
              },
            },
          },
        }}
        plugins={[ChartDataLabels]}
        style={{ height: "40rem" }}
        className='w-full'
      />
    ),
    [data]
  );

  return (
    <div className='grid grid-nogutter justify-content-center'>
      <div className='col-12'>
        <PageTitle>Estadisticas</PageTitle>
      </div>

      <div className='col-10 md:col-8 lg:col-4 text-center mb-4'>
        <DateRange startDate={startDate} endDate={endDate} onChange={onChange} />
      </div>

      <div className='col-12'>
        <div className='grid grid-nogutter justify-content-around'>
          {!queryReporte.isFetching && (
            <>
              <div className='my-2 col-11 md:col-5 lg:col-4'>{chartMemo}</div>
              <div className='my-2 col-11 md:col-5 lg:col-4 align-content-center'>
                <DataTable
                  value={valueDataTable}
                  className='border-1 border-gray-200'
                  stripedRows
                  showGridlines
                  size='small'
                  rowHover>
                  <Column
                    header='Estado'
                    body={(rowData) => (
                      <div>
                        <Tag
                          role='button'
                          className='py-2 w-full m-0'
                          style={{
                            backgroundColor: rowData.backgroundColor,
                            color: rowData.color,
                          }}>
                          {rowData.label}
                        </Tag>
                      </div>
                    )}
                  />
                  <Column header='Cantidad' field='cantidad' className='text-center font-bold' />
                </DataTable>
              </div>
            </>
          )}
        </div>
      </div>

      {!queryReporteList.isFetching && (
        <div className='col-11 mt-4 mb-8'>
          <DataTable
            header={
              <Toolbar
                start={
                  <Dropdown
                    className='w-20rem'
                    options={queryReporteList?.data?.estados || []}
                    value={selectedEstado}
                    onChange={({ value }) => setSelectedEstado(value)}
                    showClear
                    placeholder='Seleccione un estado'
                  />
                }
                end={
                  <Button
                    icon={PrimeIcons.PRINT}
                    onClick={() => {
                      downloadReport(new CitaService().reporteListStatsXlsx(startDate, endDate));
                    }}
                  />
                }
              />
            }
            value={citas}
            className='border-1 border-gray-200'
            stripedRows
            showGridlines
            size='small'
            rowHover
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
            currentPageReportTemplate='{totalRecords} Registros'>
            <Column
              header='#'
              className='text-center font-bold'
              body={(_, { rowIndex }) => {
                return rowIndex + 1;
              }}
            />
            <Column header='Título' field='titulo' />
            <Column
              header='Fecha'
              field='fecha'
              className='text-center w-10rem'
              body={(rowData) => <p className='m-0 p-0 w-10rem mx-auto'>{rowData.fecha}</p>}
            />
            {/* <Column header='Duración' field='duracion' className='text-center' /> */}
            <Column
              header='Estado'
              className='text-center'
              style={{ minWidth: "11rem", maxWidth: "15rem" }}
              body={(rowData) => (
                <Tag
                  role='button'
                  className='py-2 w-full m-0'
                  style={{
                    backgroundColor: rowData.backgroundColor,
                    color: rowData.color,
                  }}>
                  {rowData.estado}
                </Tag>
              )}
            />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default ReporteGeneralPage;
