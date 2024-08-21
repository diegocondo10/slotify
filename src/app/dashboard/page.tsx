"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event, SlotInfo } from "react-big-calendar";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) => format(date, formatStr, { locale: es, ...options }),
  parse: (dateStr, formatStr, options) =>
    parse(dateStr, formatStr, new Date(), { locale: es, ...options }),
  startOfWeek: (date, options) => startOfWeek(date, { locale: es, ...options }),
  getDay: (date) => getDay(date),
  locales,
});

const messages = {
  allDay: "Todo el día",
  previous: "< Atrás",
  next: "Siguiente >",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango.",
  showMore: (total) => `+ Ver más (${total})`,
};

const DashboardPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const onSelectSlot = (slotInfo: SlotInfo) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        title: `Evento ${prevEvents.length + 1}`,
        start: slotInfo.start,
        end: slotInfo.end || slotInfo.start,
        resource: {
          message: "Este es un evento",
        },
      },
    ]);
  };

  const eventPropGetter = (event: Event) => {
    let backgroundColor = event.title.includes("1") ? "#00ff09" : "#00BFFF";
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "1px solid transparent",
        display: "block",
      },
    };
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        culture='es'
        messages={messages} // Pasa los mensajes personalizados aquí
        style={{ height: "calc(100vh - 60px)" }}
        defaultDate={new Date()}
        onSelectSlot={onSelectSlot}
        selectable
        views={["week", "day"]}
        defaultView='week'
        onSelectEvent={(evt) => console.log(evt)}
        events={events}
        eventPropGetter={eventPropGetter}
        scrollToTime={new Date()}
        min={new Date(new Date().setHours(7, 0, 0, 0))}
        max={new Date(new Date().setHours(22, 0, 0, 0))}
      />
    </div>
  );
};

export default DashboardPage;
