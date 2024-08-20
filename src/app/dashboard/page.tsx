"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "es-ES": require("date-fns"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DashboardPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const onSelectSlot = (slotInfo: SlotInfo) => {
    console.log("ON SELECT: ", slotInfo);
    events.push({
      title: `Evento ${events.length + 1}`, // Puedes cambiar la lógica para el título según tus necesidades
      start: slotInfo.start,
      end: slotInfo.end || slotInfo.start,
      resource: {
        message: "Este es un evento",
      },
    });
    setEvents([...events]);
  };
  const eventPropGetter = (event: Event) => {
    let backgroundColor = event.title.includes("1") ? "#00ff09" : "#00BFFF"; // Oro para eventos que contienen "1", azul para otros
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "1px",
        display: "block",
      },
    };
  };
  return (
    <div className=''>
      <Calendar
        localizer={localizer}
        style={{ height: "calc(100vh - 60px)" }}
        defaultDate={new Date()}
        onSelectSlot={onSelectSlot}
        selectable
        views={["week", "day"]}
        defaultView='week'
        onSelectEvent={(evt) => {
          console.log("", evt);
        }}
        events={events}
        eventPropGetter={eventPropGetter}
        // enableAutoScroll
        // showMultiDayTimes
        // slotPropGetter={() => {
        //   return {
        //     style: {
        //       // backgroundColor: "red",
        //       // height: "100px !important",
        //     },
        //   };
        // }}

        scrollToTime={new Date()}
        min={new Date(new Date().setHours(7, 0, 0, 0))} // Rango mínimo a las 07:00 AM
        max={new Date(new Date().setHours(22, 0, 0, 0))} // Rango máximo a las 10:00 PM (22:00)
      />
    </div>
  );
};

export default DashboardPage;
