import useRouteState from "@/hooks/useRouteState";
import { addDays } from "date-fns/addDays";
import { getDay } from "date-fns/getDay";
import { Dialog } from "primereact/dialog";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";
import { ToggleButton } from "primereact/togglebutton";

const dias = [
  {
    label: "Lunes",
    value: 1,
  },
  {
    label: "Martes",
    value: 2,
  },
  {
    label: "Miercoles",
    value: 3,
  },
  {
    label: "Jueves",
    value: 4,
  },
  {
    label: "Viernes",
    value: 5,
  },
  {
    label: "Sabado",
    value: 6,
  },
  {
    label: "Domingo",
    value: 0,
  },
];

const ModalConfig = ({ show, setShow }) => {
  const { routeState, setRouteValue, setRouteState } = useRouteState<{
    hiddenDays: number[];
    threeDays: boolean;
  }>({
    stateKey: "state",
  });

  const handleOnChange = (evt: SelectButtonChangeEvent) => {
    if (evt?.value?.length !== 7) {
      setRouteValue("hiddenDays", evt.value);
    }
  };

  const calcularDias = () => {
    const today = new Date();
    const todayDayNumber = getDay(today);

    const tomorrow = addDays(today, 1);
    const dayAfterTomorrow = addDays(today, 2);

    const tomorrowDayNumber = getDay(tomorrow);
    const dayAfterTomorrowDayNumber = getDay(dayAfterTomorrow);

    const daysToShow = [todayDayNumber, tomorrowDayNumber, dayAfterTomorrowDayNumber];

    return dias.filter((dia) => !daysToShow.includes(dia.value)).map((dia) => dia.value);
  };

  return (
    <Dialog
      visible={show}
      onHide={() => {
        setShow(false);
      }}
      header='Configuraciones'
      draggable={false}
      breakpoints={{
        "960px": "75vw",
        "641px": "90vw",
      }}
      dismissableMask>
      <div className='flex flex-column justify-content-center text-center'>
        <p className='font-semibold'>Mostrar 3 días</p>
        <ToggleButton
          checked={routeState?.threeDays}
          onLabel='SI'
          offLabel='NO'
          onChange={(e) => {
            setRouteState({
              ...routeState,
              threeDays: e.value,
              hiddenDays: e.value === true ? calcularDias() : [],
            });
          }}
        />
        <hr className='w-full my-3' />
        <p className='font-semibold'>Ocultar días:</p>
        <SelectButton
          className='hidden_days'
          options={dias}
          value={routeState?.hiddenDays || []}
          onChange={handleOnChange}
          multiple
          disabled={routeState?.threeDays}
        />
      </div>
    </Dialog>
  );
};

export default ModalConfig;
