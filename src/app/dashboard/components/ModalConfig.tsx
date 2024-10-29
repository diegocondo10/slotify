import useRouteState from "@/hooks/useRouteState";
import { Dialog } from "primereact/dialog";
import { SelectButton, SelectButtonChangeEvent } from "primereact/selectbutton";

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
  const { routeState, setRouteValue } = useRouteState<{ hiddenDays: number[] }>({
    stateKey: "state",
  });

  const handleOnChange = (evt: SelectButtonChangeEvent) => {
    if (evt?.value?.length !== 7) {
      setRouteValue("hiddenDays", evt.value);
    }
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
        <hr className='w-full my-3' />
        <p className='font-semibold'>Ocultar días:</p>
        <SelectButton
          className='hidden_days'
          options={dias}
          value={routeState?.hiddenDays || []}
          onChange={handleOnChange}
          multiple
        />
      </div>
    </Dialog>
  );
};

export default ModalConfig;
