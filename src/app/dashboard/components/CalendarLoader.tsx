import { ProgressSpinner } from "primereact/progressspinner";
import React from "react";

const CalendarLoader = () => {
  return (
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
  );
};

export default CalendarLoader;
