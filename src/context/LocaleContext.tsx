"use client";
import { useEffect } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";

import { setDefaultOptions } from "date-fns";
import { es } from "date-fns/locale";
import { addLocale } from "primereact/api";

const LocaleContext = ({ children }) => {
  useEffect(() => {
    registerLocale("es", es);
    setDefaultLocale("es");

    setDefaultOptions({ locale: es });

    addLocale("es", {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      monthNamesShort: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      today: "Hoy",
      clear: "Limpiar",
      apply: "Aplicar",
    });
  }, []);

  return children;
};

export default LocaleContext;
