"use client";

import Button from "@/components/Buttons/Button";
import DeleteRecordConfirm from "@/components/DeleteRecordConfirm";
import RecordDetail from "@/components/DeleteRecordConfirm/RecordDetail";
import useDeleteRecordConfirm from "@/components/DeleteRecordConfirm/useDeleteRecordConfirm";
import { CrudActions } from "@/emuns/crudActions";
import useRouteState from "@/hooks/useRouteState";
import useToasts from "@/hooks/useToasts";
import { CitaService } from "@/services/citas/citas.service";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { NotaService } from "@/services/notas/notas.service";
import { PK } from "@/types/api";
import { formatToTimeString, toBackDate } from "@/utils/date";
import { isPwaInIOS } from "@/utils/device";
import { addIconInButton } from "@/utils/dom";
import { createClickHandler, simulateTouch } from "@/utils/events";
import { getCurrentPathEncoded } from "@/utils/router";
import { DatePointApi, DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import interactionPlugin from "@fullcalendar/interaction"; // para drag and drop
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // vistas de semana y día
import classNames from "classnames";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { isEqual } from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FaTasks } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { GrNotes } from "react-icons/gr";
import { useQuery } from "react-query";
import CalendarLoader from "./components/CalendarLoader";
import ModalConfig from "./components/ModalConfig";
import OverlayPanelNotas from "./components/OverlayPanelNotas";
import SummaryFooter from "./components/SummaryFooter";

const citaService = new CitaService();
const estadoService = new EstadoCitaService();
const notasService = new NotaService();

type SummaryType = Record<
  string,
  Record<string, { total: number; color: string; textColor: string; label: string }>
>;

type RouteStateProps = {
  currentRange: {
    start: Date;
    end: Date;
  };
  view: string;
  hiddenDays?: number[];
  threeDays?: boolean;
};

const WEEK_VIEW = "timeGridWeek";

const DAY_VIEW = "timeGridDay";

const DashboardPage = () => {
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const opNotas = useRef(null);

  const calendarRef = useRef<FullCalendar>(null);
  const getCalendarApi = () => calendarRef.current?.getApi();
  const [selectedEvent, setSelectedEvent] = useState<EventImpl>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const toast = useToasts();

  const { routeState, setRouteState, setRouteValue, isInitializing } =
    useRouteState<RouteStateProps>({
      stateKey: "state",
      defaultValues: {
        currentRange: {
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        },
        view: WEEK_VIEW,
        hiddenDays: [],
        threeDays: false,
      },
      onLoad: (state) => {
        const view = state?.view || WEEK_VIEW;
        getCalendarApi().changeView(view);
        getCalendarApi().gotoDate(state?.currentRange?.start || new Date());
      },
    });

  const calendarApi = calendarRef.current?.getApi();

  const currentRange = routeState?.currentRange;

  const enableQuery = isInitializing === false && !!currentRange?.start && !!currentRange?.end;

  const queryCitas = useQuery<any>(
    ["citas", currentRange],
    () => citaService.listByRange(currentRange.start, currentRange.end),
    {
      enabled: enableQuery,
      onSuccess: (citas) => {
        simulateTouch();
        op.current.hide();
        opNotas.current.hide();
      },
    }
  );

  const queryNotas = useQuery<any[]>(
    ["notas", currentRange],
    () => notasService.listByRange(currentRange.start, currentRange.end),
    {
      enabled: !!currentRange?.start && !!currentRange?.end,
    }
  );

  const queryEstados = useQuery(["estados_citas"], () => estadoService.listAsLabelValue());

  const eventos: any[] = queryCitas?.data?.eventos || [];
  const summary: SummaryType = queryCitas.data?.summary || {};

  const hiddenDays = routeState?.hiddenDays || [];

  const handleEventClick = createClickHandler<EventClickArg>((info: EventClickArg) => {
    //@ts-ignore
    op.current.toggle(info.jsEvent, info.el);
    setSelectedEvent(info.event);
  });

  const handleEventDrop = async (info: EventClickArg): Promise<void> => {
    const oldEvent = eventos.find((event) => +event.id === +info.event.id);

    await citaService.reagendar(info.event.id, {
      fecha: toBackDate(info.event.start),
      horaInicio: formatToTimeString(info.event.start),
      horaFin: formatToTimeString(info.event.end),
    });
    await queryCitas.refetch();
    queryNotas.refetch();
    toast.jsxToast(
      (t) => (
        <div className='flex flex-row text-sm'>
          <div className='align-self-center mr-3 text-center'>
            <Button
              className='text-white'
              label='OK'
              size='large'
              onClick={() => toast.dismiss(t.id)}
            />
          </div>
          <div>
            Se movio a <strong>{info.event.title}</strong> de:
            <br />
            {format(oldEvent.start, "EEEE dd 'a las' hh:mm a")}
            <br /> a <br />
            {format(info.event.start, "EEEE dd 'a las' hh:mm a")}
          </div>
          <div className='align-self-center ml-3 text-center'>
            <Button
              className='text-white'
              label='Deshacer'
              size='large'
              onClick={async () => {
                toast.dismiss(t.id);
                await citaService.reagendar(info.event.id, {
                  fecha: toBackDate(oldEvent.start),
                  horaInicio: formatToTimeString(oldEvent.start),
                  horaFin: formatToTimeString(oldEvent.end),
                });
                await queryCitas.refetch();
              }}
            />
          </div>
        </div>
      ),
      {
        position: "bottom-center",
        duration: 7000,
        style: {
          backgroundColor: "#494949",
          color: "white",
          minWidth: "30rem",
        },
      }
    );
    simulateTouch();
  };

  const handleSlotClick = createClickHandler((info: DatePointApi) => {
    const fecha = encodeURIComponent(info.date.toISOString());
    const goBackTo = getCurrentPathEncoded();
    router.push(`/dashboard/cita?action=${CrudActions.CREATE}&fecha=${fecha}&goBackTo=${goBackTo}`);
  });

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    if (isInitializing) {
      return;
    }

    const newRange = {
      start: startOfWeek(dateInfo.start, { weekStartsOn: 1 }),
      end: endOfWeek(dateInfo.start, { weekStartsOn: 1 }),
    };

    if (
      !isEqual(newRange.start, currentRange?.start) ||
      !isEqual(newRange.end, currentRange?.end)
    ) {
      setRouteState({
        currentRange: newRange,
        view: dateInfo.view.type,
      });
    }
  };

  const isWeekView = getCalendarApi()?.view?.type === WEEK_VIEW;

  const handlePagar = async () => {
    op.current.hide();
    await citaService.pagar(selectedEvent.id);
    queryCitas.refetch();
  };

  const handleCambiarEstado = (pk: PK, idEstado: PK) => async () => {
    op.current.hide();
    await citaService.cambiarEstado(pk, idEstado);
    queryCitas.refetch();
  };

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();

  useEffect(() => {
    addIconInButton(".fc-customReload-button", "fa fa-solid fa-rotate");
    addIconInButton(".fc-customConfig-button", "fa fa-solid fa-gear");
  }, []);

  const [calcHeight, setCalcHeight] = useState(0);

  const calcularHeight = () => {
    const viewportHeight = window.innerHeight;

    const navbarElement = document.querySelector("#navbar");
    const summaryToolbarElement = document.querySelector("#summary_toolbar");

    const navbarHeight = navbarElement?.clientHeight || 0;
    const summaryToolbarHeight = summaryToolbarElement?.clientHeight || 0;
    const extraHeight = isPwaInIOS() ? 20 : 10;

    setCalcHeight(viewportHeight - (navbarHeight + summaryToolbarHeight + extraHeight));
  };

  useEffect(() => {
    calcularHeight();
  }, [isWeekView]);

  const onDoubleClickDayHeader = (date: string) => () => {
    opNotas.current.hide();
    calendarApi.changeView(DAY_VIEW, date);
    setRouteValue("view", DAY_VIEW);
  };

  const onOneClickDayHeader = (date: string) => async (event: any) => {
    opNotas.current.fetchNota(event, date);
  };

  useEffect(() => {
    if (calendarRef.current) {
      //@ts-ignore
      const calendarEl = calendarRef.current?.elRef?.current;
      const headerEl = calendarEl.querySelector(".fc-timegrid-axis");

      createRoot(headerEl).render(
        <Link
          className='p-component p-button p-button-sm p-button-danger p-button-text text-sm p-1'
          href='/dashboard/wait-list'>
          Lista de espera
        </Link>
      );
    }
  }, []);

  return (
    <div style={{ height: `${calcHeight}px`, width: "100vw" }}>
      {queryCitas.isFetching && <CalendarLoader />}

      <DeleteRecordConfirm
        ref={deleteRecordRef}
        messageDetail={(record: EventImpl) => (
          <RecordDetail
            title='¿Estas seguro de eliminar esta cita?'
            items={[
              ["Paciente", record.title],
              [
                "Estado",
                <Tag
                  key={record.id}
                  style={{
                    backgroundColor: record.backgroundColor,
                    color: record.textColor,
                  }}>
                  {record.extendedProps.estadoLabel}
                </Tag>,
              ],
              ["Fecha", format(record.start, "dd/MM/yyy")],
              [
                "Hora",
                <div key={record.id}>
                  {format(record.start, "hh:mm a")} {" - "}
                  {format(record.end, "hh:mm a")}
                </div>,
              ],
              ["Notas", record.extendedProps?.notas],
              ["Tareas", record.extendedProps?.tareas],
            ]}
          />
        )}
        onAccept={async (record: EventImpl) => {
          await citaService.delete(record.id);
          await queryCitas.refetch();
          queryNotas.refetch();
          toast.addSuccessToast("Se ha eliminado la cita correctamente");
        }}
      />

      <OverlayPanel style={{ minWidth: "25rem", maxWidth: "30rem" }} ref={op} dismissable>
        {selectedEvent && (
          <div className='flex flex-column'>
            <div className='flex flex-row align-items-center'>
              <h4 className='m-0'>{selectedEvent.title}</h4>
              <div className='flex flex-row w-8rem justify-content-around'>
                <Button
                  className='mx-1'
                  sm
                  variant='info'
                  icon={PrimeIcons.PENCIL}
                  rounded
                  onClick={() => {
                    const goBackTo = getCurrentPathEncoded();
                    router.push(
                      `/dashboard/cita?action=${CrudActions.UPDATE}&id=${selectedEvent.id}&goBackTo=${goBackTo}`
                    );
                  }}
                />
                <Button
                  className='mx-1'
                  sm
                  variant='success'
                  icon={PrimeIcons.DOLLAR}
                  rounded
                  onClick={handlePagar}
                  outlined={selectedEvent?.extendedProps?.isPagada === false}
                />
                <Button
                  className='mx-1'
                  sm
                  variant='danger'
                  icon={PrimeIcons.TRASH}
                  rounded
                  disabled={selectedEvent.extendedProps.isPagada}
                  onClick={deleteEvent(selectedEvent)}
                />
              </div>
            </div>
            <div>
              <Tag
                style={{
                  backgroundColor: selectedEvent.backgroundColor,
                  color: selectedEvent.textColor,
                }}>
                {selectedEvent.extendedProps.estadoLabel}
              </Tag>
            </div>
            {selectedEvent.extendedProps.isPagada && (
              <div>
                <Tag>Pagada</Tag>
              </div>
            )}

            <div className='flex flex-row my-2 mx-auto'>
              {queryEstados.data?.map((estado) => (
                <div
                  role='button'
                  key={estado.value.codigo}
                  className='border-1 border-gray-500 border-round text-center flex flex-column justify-content-center mx-1 font-bold cursor-pointer'
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: estado.value.color,
                    color: estado.value.colorLetra,
                  }}
                  onClick={handleCambiarEstado(selectedEvent.id, estado.value.id)}>
                  {estado.value.codigo}
                </div>
              ))}
            </div>

            <p className='my-1'>
              <strong>Fecha:</strong> {format(selectedEvent.start, "dd/MM/yyy")}
            </p>
            <p className='my-1'>
              <strong>Hora:</strong> {format(selectedEvent.start, "hh:mm a")} {" - "}
              {selectedEvent?.end && format(selectedEvent?.end, "hh:mm a")}
            </p>
            {selectedEvent.extendedProps.hasNotas && (
              <p className='my-1'>
                <strong>Notas:</strong> {selectedEvent.extendedProps?.notas}
              </p>
            )}
            {selectedEvent.extendedProps.hasTareas && (
              <p className='my-1'>
                <strong>Tareas:</strong> {selectedEvent.extendedProps?.tareas}
              </p>
            )}
          </div>
        )}
      </OverlayPanel>

      <OverlayPanelNotas ref={opNotas} refetchNotas={queryNotas.refetch} />

      <ModalConfig show={showConfigModal} setShow={setShowConfigModal} />

      <FullCalendar
        ref={calendarRef}
        nowIndicator
        windowResize={calcularHeight}
        dayHeaderContent={(props) => {
          const formatedDate = toBackDate(props.date);
          return (
            <div
              role='button'
              className='h-full flex flex-column align-content-center justify-content-center'
              style={{ minHeight: "34px" }}
              onClick={createClickHandler(
                onDoubleClickDayHeader(formatedDate),
                onOneClickDayHeader(formatedDate)
              )}>
              <div>
                {queryNotas?.data?.[formatedDate] && (
                  <i className={classNames(PrimeIcons.FILE, "text-sm mr-1")} />
                )}
                {props.text}
              </div>
            </div>
          );
        }}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView={WEEK_VIEW} // Vista inicial en el calendario
        locale='es' // Configura el idioma a español
        weekends={true} // Mostrar fines de semana
        eventResizableFromStart={false}
        _resize={() => false}
        dateClick={handleSlotClick}
        editable={true} // Habilita el drag and drop
        events={eventos || []}
        eventContent={(renderProps) => {
          const { event } = renderProps;
          return (
            <div className='flex h-full'>
              <div className='fc-event-title'>
                {event.extendedProps.isPagada && (
                  <FaSackDollar style={{ color: event.textColor, fontSize: "0.9rem" }} />
                )}

                {event.extendedProps.hasNotas && (
                  <GrNotes style={{ color: event.textColor, fontSize: "0.8rem" }} />
                )}

                {event.extendedProps.hasTareas && (
                  <FaTasks style={{ color: event.textColor, fontSize: "0.8rem" }} />
                )}

                {event.title}
              </div>
            </div>
          );
        }}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "customConfig,customReload,customWeek,customDay",
        }}
        buttonText={{
          today: "Hoy",
          week: "Semana",
          day: "Día",
        }}
        customButtons={{
          customConfig: {
            click: () => {
              setShowConfigModal(true);
            },
          },
          customReload: {
            click: () => {
              queryCitas.refetch();
              queryNotas.refetch();
            },
          },
          customWeek: {
            text: "Semana",
            click: (evt) => {
              calendarApi.changeView(WEEK_VIEW);
              setRouteValue("view", WEEK_VIEW);
            },
          },
          customDay: {
            text: "Día",
            click: () => {
              calendarApi.changeView(DAY_VIEW);
              setRouteValue("view", DAY_VIEW);
            },
          },
        }}
        allDaySlot={false} // Desactiva el slot de todo el día
        slotMinTime='05:00:00' // Hora mínima disponible (5:00 AM)
        slotMaxTime='22:00:00' // Hora máxima disponible (10:00 PM)
        // slotDuration='00:05:00' // Intervalo de 1 hora entre los slots
        slotDuration='01:00:00' // Intervalo de 1 hora entre los slots
        snapDuration='01:00:00' // Asegura que los eventos se muevan en intervalos de 1 hora
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true, // Formato de 12 horas (AM/PM)
          meridiem: "short",
        }}
        slotLabelContent={(info) => {
          return format(info.date, "hh:mm a").toUpperCase();
        }}
        firstDay={1}
        hiddenDays={hiddenDays}
        eventDrop={handleEventDrop} // Manejador para cuando se arrastra y suelta un evento
        eventClick={handleEventClick} // Manejador para clic en un evento
        dragRevertDuration={300}
        eventDurationEditable
        height='100%' // Hace que el calendario ocupe el 100% del contenedor
        expandRows={true} // Asegura que las filas se expandan para ocupar el espacio disponible
        datesSet={handleDatesSet} // Manejador para capturar la fecha visible actual
        longPressDelay={300} // Reduce el tiempo necesario para empezar a arrastrar en dispositivos móviles
        dragScroll={false} // Permite que la vista se desplace mientras arrastras un evento
        lazyFetching
      />
      {isWeekView && <SummaryFooter summary={summary} hiddenDays={hiddenDays} />}
    </div>
  );
};

export default DashboardPage;
