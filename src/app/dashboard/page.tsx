"use client";

import { CitaService } from "@/services/citas/citas.service";
import interactionPlugin from "@fullcalendar/interaction"; // para drag and drop
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // vistas de semana y día
import { isEqual } from "date-fns";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import CitaModal from "./components/CitaModal";

const DashboardPage = () => {
  const dialogRef = useRef(null);
  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date }>({
    start: null,
    end: null,
  });
  const queryCitas = useQuery(
    ["citas", currentRange],
    () => new CitaService().listByRange(currentRange.start, currentRange.end),
    {
      enabled: !!currentRange.start && !!currentRange.end, // Solo habilitar cuando hay un rango definido
      onSuccess(data) {
        console.log(data);
      },
    }
  );

  const handleEventClick = (info: any): void => {
    dialogRef.current.editar(info.event.id);
  };

  const handleEventDrop = (info: any): void => {
    console.log(`Evento "${info.event.title}" movido a ${info.event.start}`);
  };

  const handleSlotClick = (info) => {
    dialogRef.current.agregar({ date: info.date });
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
      <CitaModal ref={dialogRef} />
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek' // Vista inicial en el calendario
        locale='es' // Configura el idioma a español
        weekends={true} // Mostrar fines de semana
        editable={true} // Habilita el drag and drop
        droppable={true} // Permite arrastrar eventos externos
        eventResizableFromStart={false}
        dateClick={handleSlotClick}
        events={
          queryCitas?.data ||
          [
            // {
            // }
          ]
        }
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay", // Solo las vistas de semana y día
        }}
        buttonText={{
          today: "Hoy",
          week: "Semana",
          day: "Día",
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
        height='100%' // Hace que el calendario ocupe el 100% del contenedor
        expandRows={true} // Asegura que las filas se expandan para ocupar el espacio disponible
        snapDuration='01:00:00' // Asegura que los eventos se muevan en intervalos de 1 hora
        datesSet={handleDatesSet} // Manejador para capturar la fecha visible actual
      />
    </div>
  );
};

export default DashboardPage;
