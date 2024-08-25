import { format, setHours, setMinutes } from "date-fns";
import moment from "moment";
export const DATE_FORMAT = "yyyy-MM-DD";
export const DATE_TIME_FORMAT = "yyyy-MM-DD HH:mm";

export const formatearFechaBackend = (date: any = moment().toDate()) =>
  moment(date).format(DATE_FORMAT);
export const formatearFechaFronend = (date: any) => moment(date).toDate();

export const toFrontDate = (date: string) => {
  return moment(date).toDate();
};

export const toBackDate = (date: any = moment().toDate(), format = DATE_FORMAT) => {
  return moment(date).format(format);
};

export const formatToTimeString = (date: Date, fomat = "HH:mm:ss") => {
  return format(date, fomat);
};

export const generarFechasEntre = (startDate: moment.Moment, endDate: moment.Moment) => {
  const now = startDate.clone();
  const fechas = {};
  while (now.isSameOrBefore(endDate)) {
    const values = {
      mesNumber: now.get("M"),
      mesStr: now.format("MMMM").toUpperCase(),
      diaNumber: now.format("DD"),
      diaSemanaStr: now.format("dd").toUpperCase(),
      dateStr: now.format("YYYY-MM-DD"),
    };

    const dias: any[] = fechas?.[values.mesStr]?.dias || [];
    dias.push({
      str: values.diaSemanaStr,
      number: values.diaNumber,
      date: values.dateStr,
    });
    fechas[values.mesStr] = {
      str: values.mesStr,
      number: values.mesNumber,
      dias: dias,
    };
    now.add(1, "days");
  }
  return fechas;
};

export const generateTimes = (startHour: number, endHour: number) => {
  const times = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      times.push(setHours(setMinutes(new Date(), minute), hour));
    }
  }
  return times;
};

export const getMinMaxTimesAmPm = (isAM: boolean = true) => {
  const minTime = isAM
    ? setHours(setMinutes(new Date(), 0), 0)
    : setHours(setMinutes(new Date(), 0), 12);
  const maxTime = isAM
    ? setHours(setMinutes(new Date(), 59), 11)
    : setHours(setMinutes(new Date(), 59), 23);
  return { minTime, maxTime };
};

export const isAm = (): boolean => {
  const hours = new Date().getHours();
  return hours < 12;
};

export const isDateAm = (date: Date) => {
  return date.getHours() < 12;
};
