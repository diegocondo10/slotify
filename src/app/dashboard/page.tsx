"use client";

import Button from "@/components/Buttons/Button";
import DeleteRecordConfirm from "@/components/DeleteRecordConfirm";
import RecordDetail from "@/components/DeleteRecordConfirm/RecordDetail";
import useDeleteRecordConfirm from "@/components/DeleteRecordConfirm/useDeleteRecordConfirm";
import { CrudActions } from "@/emuns/crudActions";
import useToasts from "@/hooks/useToasts";
import { CitaService } from "@/services/citas/citas.service";
import { formatToTimeString, toBackDate } from "@/utils/date";
import { createClickHandler, simulateTouch } from "@/utils/events";
import { DatePointApi, DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import interactionPlugin from "@fullcalendar/interaction"; // para drag and drop
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // vistas de semana y día
import { format, isEqual } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useEffect, useRef, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { GrNotes } from "react-icons/gr";
import { useQuery } from "react-query";
import OverlayPanelNotas from "./components/OverlayPanelNotas";

const citaService = new CitaService();

type SummaryType = Record<
  string,
  Record<string, { total: number; color: string; textColor: string; label: string }>
>;

const DashboardPage = () => {
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const opNotas = useRef<OverlayPanel>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventImpl>(null);
  const [selectedDateHeader, setSelectedDateHeader] = useState<string>(null);

  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date }>({
    start: null,
    end: null,
  });

  const toast = useToasts();

  const queryCitas = useQuery<any>(
    ["citas", currentRange],
    () => citaService.listByRange(currentRange.start, currentRange.end),
    {
      enabled: !!currentRange.start && !!currentRange.end, // Solo habilitar cuando hay un rango definido,
      onSuccess: (citas) => {
        op.current.hide();
        opNotas.current.hide();
      },
    }
  );

  const eventos: any[] = queryCitas?.data?.eventos || [];
  const summary: SummaryType = queryCitas.data?.summary || {};

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
    simulateTouch(blurRef.current);
  };

  const handleSlotClick = createClickHandler((info: DatePointApi) => {
    const fecha = encodeURIComponent(info.date.toISOString());
    router.push(`/dashboard/cita?action=${CrudActions.CREATE}&fecha=${fecha}`);
  });

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const newRange = {
      start: dateInfo?.start,
      end: dateInfo?.end,
    };

    if (!isEqual(newRange.start, currentRange.start) || !isEqual(newRange.end, currentRange.end)) {
      setCurrentRange(newRange);
    }
  };

  const search = useSearchParams();
  const isWeekView = search.get("view") === "timeGridWeek";
  
  useEffect(() => {
    const getDateFromHeader = (event: any) => {
      const target = event.target.closest(".fc-col-header-cell");
      return target.getAttribute("data-date");
    };

    const onDoubleClickDayHeader = (event: any) => {
      opNotas.current.hide();
      const date = getDateFromHeader(event);
      if (date && calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const path = `?view=timeGridDay&date=${encodeURIComponent(date)}`;
        router.push(window.location.pathname + path);
        calendarApi.changeView("timeGridDay", date);
      }
    };

    const onOneClickDayHeader = async (event: any) => {
      const date = getDateFromHeader(event);
      setSelectedDateHeader(date);
      //@ts-ignore
      opNotas.current.toggle(event);
    };

    const handleDayHeaderClick = createClickHandler(onDoubleClickDayHeader, onOneClickDayHeader);

    const dayHeaders = document.querySelectorAll(".fc-col-header-cell");

    dayHeaders.forEach((header) => {
      header.addEventListener("click", handleDayHeaderClick);
    });

    return () => {
      dayHeaders.forEach((header) => {
        header.removeEventListener("click", handleDayHeaderClick);
      });
    };
  }, [currentRange]);

  const handlePagar = async () => {
    op.current.hide();
    await citaService.pagar(selectedEvent.id);
    queryCitas.refetch();
  };

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();

  useEffect(() => {
    const handleOnClickButton = (view: string) => () => {
      const currentPath = window.location.pathname;
      router.push(`${currentPath}?view=${view}`);
    };

    const weekButton = document.querySelector(".fc-timeGridWeek-button");
    const dayButton = document.querySelector(".fc-timeGridDay-button");

    const handleWeek = handleOnClickButton("timeGridWeek");
    const handleDay = handleOnClickButton("timeGridDay");

    if (weekButton) {
      weekButton.addEventListener("click", handleWeek);
    }
    if (dayButton) {
      dayButton.addEventListener("click", handleDay);
    }
    const reloadButton = document.querySelector(".fc-customReload-button");
    if (reloadButton) {
      const iconElement = document.createElement("i");
      iconElement.classList.add("fa", "fa-solid", "fa-rotate");
      reloadButton.innerHTML = "";
      reloadButton.appendChild(iconElement);
    }
    return () => {
      if (weekButton) {
        weekButton.removeEventListener("click", handleWeek);
        dayButton.removeEventListener("click", handleDay);
      }
    };
  }, []);

  useEffect(() => {
    const view = search.get("view") || "timeGridWeek";
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    }
  }, [search]);

  return (
    <div style={{ height: "calc(100vh - 100px)", width: "100vw" }}>
      {queryCitas.isFetching && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}>
          <ProgressSpinner />
          <p className='font-bold text-xl'>Buscando...</p>
        </div>
      )}
      <div
        ref={blurRef}
        tabIndex={-1}
        style={{
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

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
            ]}
          />
        )}
        onAccept={async (record: EventImpl) => {
          await citaService.delete(record.id);
          await queryCitas.refetch();
          toast.addSuccessToast("Se ha eliminado la cita correctamente");
        }}
      />

      <OverlayPanel style={{ maxWidth: "30rem" }} ref={op} dismissable>
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
                  href={`/dashboard/cita?action=${CrudActions.UPDATE}&id=${selectedEvent.id}`}
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
            <p className='my-1'>
              <strong>Fecha:</strong> {format(selectedEvent.start, "dd/MM/yyy")}
            </p>
            <p className='my-1'>
              <strong>Hora:</strong> {format(selectedEvent.start, "hh:mm a")} {" - "}
              {format(selectedEvent.end, "hh:mm a")}
            </p>
          </div>
        )}
      </OverlayPanel>

      <OverlayPanelNotas
        refOp={opNotas}
        setSelectedDateHeader={setSelectedDateHeader}
        selectedDateHeader={selectedDateHeader}
      />

      <FullCalendar
        ref={calendarRef}
        nowIndicator
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek' // Vista inicial en el calendario
        locale='es' // Configura el idioma a español
        weekends={true} // Mostrar fines de semana
        eventResizableFromStart={false}
        _resize={() => false}
        dateClick={handleSlotClick}
        editable={true} // Habilita el drag and drop
        events={eventos || []}
        eventContent={(renderProps) => {
          // Aquí puedes crear tu propio contenido personalizado
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
          right: "customReload,timeGridWeek,timeGridDay", // Solo las vistas de semana y día
        }}
        buttonText={{
          today: "Hoy",
          week: "Semana",
          day: "Día",
        }}
        customButtons={{
          customReload: {
            click: () => {
              queryCitas.refetch();
            },
          },
        }}
        allDaySlot={false} // Desactiva el slot de todo el día
        slotMinTime='05:00:00' // Hora mínima disponible (5:00 AM)
        slotMaxTime='22:00:00' // Hora máxima disponible (10:00 PM)
        slotDuration='01:00:00' // Intervalo de 1 hora entre los slots
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: true, // Formato de 12 horas (AM/PM)
        }}
        hiddenDays={[0]} // Oculta los domingos
        eventDrop={handleEventDrop} // Manejador para cuando se arrastra y suelta un evento
        eventClick={handleEventClick} // Manejador para clic en un evento
        eventResize={(evt) => {
          console.log("RESIZE: ", evt);
        }}
        dragRevertDuration={300}
        eventDurationEditable
        height='100%' // Hace que el calendario ocupe el 100% del contenedor
        expandRows={true} // Asegura que las filas se expandan para ocupar el espacio disponible
        snapDuration='01:00:00' // Asegura que los eventos se muevan en intervalos de 1 hora
        datesSet={handleDatesSet} // Manejador para capturar la fecha visible actual
        longPressDelay={300} // Reduce el tiempo necesario para empezar a arrastrar en dispositivos móviles
        dragScroll={true} // Permite que la vista se desplace mientras arrastras un evento
      />
      {isWeekView && (
        <div className='grid-sumary-container'>
          <div className='grid-sumary-item text-center py-2'>
            <p className='p-0 m-0 text-sm'>Confirmados</p>
          </div>
          {Object.entries(summary).map(([key, value]) => (
            <div className='grid-sumary-item flex flex-column justify-content-around' key={key}>
              {Object.entries(value).map(([codigoEstado, sumario]) => (
                <Tag
                  key={key + codigoEstado}
                  className='text-left'
                  style={{ backgroundColor: sumario.color, color: sumario.textColor }}>
                  {sumario.total}
                </Tag>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
