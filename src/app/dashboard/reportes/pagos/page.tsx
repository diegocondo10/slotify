"use client";
import PageTitle from "@/components/pages/PageTitle";
import IndexColumn from "@/components/Tables/IndexColumn";
import useRouteState from "@/hooks/useRouteState";
import { CitaService } from "@/services/citas/citas.service";
import { getTextColorForBackground } from "@/utils/color";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { endOfMonth, startOfMonth } from "date-fns";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { MdOutlinePaid } from "react-icons/md";
import { useQuery } from "react-query";
import DateRange from "../components/DateRange";

const citaService = new CitaService();

const PayReportPage = () => {
  const { routeState, setRouteState } = useRouteState<{ start: Date; end: Date }>({
    defaultValues: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  const startDate = routeState?.start;
  const endDate = routeState?.end;

  const queryReport = useQuery(
    ["pay-stats", startDate, endDate],
    () => citaService.payReport(startDate, endDate),
    {
      enabled: !!startDate && !!endDate,
    }
  );

  const onChange = (dates) => {
    const [start, end] = dates;
    setRouteState({ start, end });
  };

  return (
    <div className='grid grid-nogutter justify-content-center'>
      <div className='col-12'>
        <PageTitle>Pagos</PageTitle>
      </div>
      <div className='col-10 md:col-8 lg:col-4 text-center mb-4'>
        <DateRange startDate={startDate} endDate={endDate} onChange={onChange} />
      </div>

      <div className='col-12'>
        <Chart
          type='pie'
          plugins={[ChartDataLabels]}
          data={{
            labels: ["Pagadas", "Pendientes de pago"],
            datasets: [
              {
                data: [
                  (
                    (queryReport?.data?.paidAppointments / queryReport?.data?.totalAppointments) *
                    100
                  ).toFixed(2),
                  (
                    (queryReport?.data?.unPaidAppointments / queryReport?.data?.totalAppointments) *
                    100
                  ).toFixed(2),
                ],
                backgroundColor: ["#2e86c1", "#d5d8dc"],
                hoverBackgroundColor: ["#1f5a8b", "#a4a6a9"],
              },
            ],
          }}
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
                  size: 20, 
                  weight: "semi-bold",
                },
                formatter: (value) => {
                  return `${value}%`;
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw}%`;
                  },
                },
              },
            },
          }}
        />
      </div>

      {queryReport.isFetched && queryReport?.data && (
        <div className='col-11 my-4'>
          <DataTable
            value={queryReport.data?.appointments}
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
            {IndexColumn()}

            <Column header='Título' field='label' />
            <Column header='Citas' field='count' className='text-center' />
            {queryReport?.data?.statusStats.map((status) => (
              <Column
                key={status.id}
                header={
                  <div className='flex flex-row justify-content-around'>
                    <span>{status.label}</span>
                    <Tag
                      className='my-auto mx-1'
                      rounded
                      style={{
                        color: status.color,
                        backgroundColor: status.backgroundColor,
                      }}>
                      {status.count}
                    </Tag>
                  </div>
                }
                className='text-center'
                body={(rowData) => {
                  return (
                    <div className='text-lg flex flex-row align-content-center justify-content-around'>
                      <div className='flex'>
                        <MdOutlinePaid className='text-green-600 mx-2 text-xl' />
                        <span>{rowData.status[status.slug]?.paid || 0}</span>
                      </div>
                      <div className='flex'>
                        <MdOutlinePaid className='text-red-600 mx-2 text-xl' />
                        {rowData.status[status.slug]?.unPaid || 0}
                      </div>
                    </div>
                  );
                }}
              />
            ))}
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default PayReportPage;
