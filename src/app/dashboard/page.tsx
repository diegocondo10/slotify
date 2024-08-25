"use client";

import interactionPlugin from "@fullcalendar/interaction"; // para drag and drop
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid"; // vistas de semana y día
import { useRef, useState } from "react";
import CitaModal from "./components/CitaModal";

const DashboardPage = () => {
  const dialogRef = useRef(null);
  const [events, setEvents] = useState<any[]>([
    {
      title: "Evento 1",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      color: "#FF5733", // Color personalizado para el evento 1
    },
    {
      title: "Evento 2",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      color: "#33C3FF", // Color personalizado para el evento 2
    },
  ]);
  const handleEventClick = (info: any): void => {
    alert(`Has hecho clic en el evento: ${info.event.title}`);
    console.log(`Un solo clic en el evento: ${info.event.title}`);
  };

  const handleEventDrop = (info: any): void => {
    console.log(`Evento "${info.event.title}" movido a ${info.event.start}`);
  };

  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100vw" }}>
      <CitaModal
        ref={dialogRef}
        onComplete={(event) => {
          setEvents((prevEvents) => [...prevEvents, event]);
        }}
      />
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek' // Vista inicial en el calendario
        locale='es' // Configura el idioma a español
        weekends={true} // Mostrar fines de semana
        editable={true} // Habilita el drag and drop
        droppable={true} // Permite arrastrar eventos externos
        eventResizableFromStart={false}
        dateClick={(info) => {
          dialogRef.current.agregar({ date: info.date });
        }}
        events={events}
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
      />
    </div>
  );
};

export default DashboardPage;
