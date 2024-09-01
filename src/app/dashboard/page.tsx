"use client";

import Button from "@/components/Buttons/Button";
import { CrudActions } from "@/emuns/crudActions";
import { CitaService } from "@/services/citas/citas.service";
import { formatToTimeString, toBackDate } from "@/utils/date";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { EventImpl } from "@fullcalendar/core/internal";
import interactionPlugin from "@fullcalendar/interaction"; // para drag and drop
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // vistas de semana y día
import { format, isEqual } from "date-fns";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

const DashboardPage = () => {
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventImpl>(null);
  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date }>({
    start: null,
    end: null,
  });
  const [triggerRerender, setTriggerRerender] = useState(false); // Estado para forzar re-render

  const queryCitas = useQuery(
    ["citas", currentRange],
    () => new CitaService().listByRange(currentRange.start, currentRange.end),
    {
      enabled: !!currentRange.start && !!currentRange.end, // Solo habilitar cuando hay un rango definido,
      onSuccess: () => {
        op.current.hide();
      },
    }
  );
  let eventClickTimeOut = null;
  const handleEventClick = (info: EventClickArg): void => {
    if (eventClickTimeOut) {
      clearTimeout(eventClickTimeOut);
      //@ts-ignore
      op.current.toggle(info.jsEvent, info.el);
      setSelectedEvent(info.event);
    } else {
      eventClickTimeOut = setTimeout(() => {
        eventClickTimeOut = null;
      }, 300);
    }
  };

  const handleEventDrop = async (info: EventClickArg): Promise<void> => {
    await new CitaService().reagendar(info.event.id, {
      fecha: toBackDate(info.event.start),
      horaInicio: formatToTimeString(info.event.start),
      horaFin: formatToTimeString(info.event.end),
    });
    queryCitas.refetch();

    if (blurRef.current) {
      const touch = new Touch({
        identifier: Date.now(),
        target: blurRef.current,
        clientX: blurRef.current.getBoundingClientRect().left,
        clientY: blurRef.current.getBoundingClientRect().top,
        pageX: blurRef.current.getBoundingClientRect().left + window.scrollX,
        pageY: blurRef.current.getBoundingClientRect().top + window.scrollY,
        screenX: blurRef.current.getBoundingClientRect().left,
        screenY: blurRef.current.getBoundingClientRect().top,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        force: 1,
      });

      const touchStartEvent = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [touch],
      });

      const touchEndEvent = new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        touches: [touch],
      });

      // Despacha los eventos táctiles en el elemento referenciado por blurRef
      blurRef.current.dispatchEvent(touchStartEvent);
      blurRef.current.dispatchEvent(touchEndEvent);
    }
  };

  useEffect(() => {
    if (triggerRerender) {
      setTriggerRerender(false);
    }
  }, [triggerRerender]);

  let clickTimeout = null;

  const handleSlotClick = (info) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;

      const fecha = encodeURIComponent(info.date.toISOString());
      router.push(`/dashboard/cita?action=${CrudActions.CREATE}&fecha=${fecha}`);
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 300);
    }
  };

  const handleDatesSet = (dateInfo) => {
    const newRange = {
      start: dateInfo?.start,
      end: dateInfo?.end,
    };

    if (!isEqual(newRange.start, currentRange.start) || !isEqual(newRange.end, currentRange.end)) {
      setCurrentRange(newRange);
    }
  };

  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100vw" }}>
      {/* Mostrar el spinner de carga cuando los datos se están cargando */}
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

      <OverlayPanel style={{ maxWidth: "20rem" }} ref={op} dismissable>
        {selectedEvent && (
          <div className='flex flex-column'>
            <div className='flex flex-row align-items-center'>
              <h4 className='m-0 w-10rem'>{selectedEvent.title}</h4>
              <div className='flex flex-row w-6rem justify-content-around'>
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
                  variant='danger'
                  icon={PrimeIcons.TRASH}
                  rounded
                  onClick={() => {
                    // Lógica para eliminar el evento
                  }}
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
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek' // Vista inicial en el calendario
        locale='es' // Configura el idioma a español
        weekends={true} // Mostrar fines de semana
        eventResizableFromStart={false}
        // eventResize={false}
        _resize={() => false}
        dateClick={handleSlotClick}
        // selectLongPressDelay={500}
        // slotEventOverlap
        editable={true} // Habilita el drag and drop
        events={queryCitas?.data || []}
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
            text: "Recargar",
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
    </div>
  );
};

export default DashboardPage;
