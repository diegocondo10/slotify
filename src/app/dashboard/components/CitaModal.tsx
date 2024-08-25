import Button from "@/components/Buttons/Button";
import DateInput from "@/components/Forms/DateInput";
import DropDown from "@/components/Forms/DropDown";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import TimePicker from "@/components/Forms/TimePicker";
import Loading from "@/components/Loading";
import { REQUIRED_MSG } from "@/constants/rules";
import { CrudActions } from "@/emuns/crudActions";
import useCreateUpdate from "@/hooks/useCreateUpdate";
import { CitaService } from "@/services/citas/citas.service";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { ClienteService } from "@/services/clientes/clientes.service";
import { PK } from "@/types/api";
import { formatToTimeString, toBackDate, toFrontDate } from "@/utils/date";
import classNames from "classnames";
import { addMonths } from "date-fns";
import { addHours } from "date-fns/addHours";
import { subDays } from "date-fns/subDays";
import { keyBy } from "lodash";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";

const CitaModal = forwardRef<any, any>(({ onComplete }, ref) => {
  const [visible, setVisible] = useState(false);
  const [estadosIndexed, setEstadosIndexed] = useState<Record<string, any>>({});
  const [title, setTitle] = useState("Nueva Cita");

  const [action, setAction] = useState<any>(CrudActions.CREATE);

  const [id, setId] = useState<PK | null>(null);

  const methods = useForm<any>({
    mode: "onChange",
  });

  const queryEstados = useQuery(
    ["estados_citas", visible],
    () => new EstadoCitaService().listAsLabelValue(),
    {
      enabled: visible,
      onSuccess: (data) => {
        setEstadosIndexed(keyBy(data, "value.id"));
      },
    }
  );

  const queryClientes = useQuery(
    ["clientes_list_label_value", visible],
    () => new ClienteService().listAsLabelValue(),
    {
      enabled: visible,
    }
  );

  const queryRetrieve = useQuery(["cita", id], () => new CitaService().retrieve(id), {
    enabled: !!id && action === CrudActions.UPDATE,
    onSuccess: ({ data }) => {
      data.fecha = toFrontDate(data.fecha);
      data.horaInicio = toFrontDate(data.horaInicio);
      data.horaFin = toFrontDate(data.horaFin);
      methods.reset(data);
    },
  });

  const mutation = useCreateUpdate({
    action,
    methods,
    create: (formData) => new CitaService().create(formData),
    update: (formData) => new CitaService().update(id, formData),
  });

  const isLoading = queryEstados.isFetching || queryClientes.isFetching || mutation.isLoading;

  const horaInicio = useWatch({
    name: "horaInicio",
    control: methods.control,
  });

  const estadoForm = useWatch({
    name: "estado",
    control: methods.control,
  });

  const estado = useMemo(() => estadosIndexed?.[estadoForm] || null, [estadoForm, estadosIndexed]);

  const onHide = () => {
    setVisible(false);
    setId(null);
    setAction(null);
  };

  useImperativeHandle(ref, () => ({
    agregar: ({ date }) => {
      setTitle("Agregar Cita");
      setVisible(true);
      setAction(CrudActions.CREATE);
      methods.reset({
        fecha: date,
        horaInicio: date,
        horaFin: addHours(date, 1),
      });
    },
    editar: (id) => {
      setTitle("Editar Cita");
      setVisible(true);
      setAction(CrudActions.UPDATE);
      setId(id);
    },
  }));
  const onSubmit = async (formData) => {
    try {
      formData.fecha = toBackDate(formData.fecha);
      formData.horaInicio = formatToTimeString(formData.horaInicio);
      formData.horaFin = formatToTimeString(formData.horaFin);

      await mutation.submitForm(formData);
      setVisible(false);
      await onComplete();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider {...methods}>
      {visible && (
        <Dialog
          visible={visible}
          onHide={onHide}
          draggable={false}
          breakpoints={{ "0px": "100vw", "641px": "80vw", "999999px": "75vw" }}
          contentStyle={{
            minHeight: "35rem",
          }}
          header={title}
          footer={
            <div className='w-full flex flex-row justify-content-around'>
              <Button
                variant='info'
                label='Regresar'
                className='w-10rem'
                onClick={onHide}
                loading={isLoading}
              />
              <Button
                label='Guardar'
                className='w-10rem'
                type='submit'
                onClick={methods.handleSubmit(onSubmit)}
                loading={isLoading}
              />
            </div>
          }>
          <Loading loading={isLoading}>
            <div className='w-full grid grid-nogutter'>
              <div className='field col-12'>
                <FormFieldRender
                  label='Paciente'
                  name='cliente'
                  render={({ name }) => (
                    <DropDown
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                      block
                      filter
                      showFilterClear
                      emptyFilterMessage={
                        <Button
                          block
                          icon={PrimeIcons.PLUS}
                          label='Agregar nuevo cliente'
                          href='/dashboard/clientes/agregar'
                        />
                      }
                      options={queryClientes.data}
                    />
                  )}
                />
              </div>

              <div className='field col-12'>
                <FormFieldRender
                  name='estado'
                  label={
                    <div className='flex flex-row my-1'>
                      <div className=' py-1'>Estado: </div>
                      {estado && (
                        <Tag
                          className='ml-2'
                          style={{
                            backgroundColor: estado.value.color,
                            color: estado.value.colorLetra,
                          }}>
                          {estado.value.label}
                        </Tag>
                      )}
                    </div>
                  }
                  render={({ name }) => (
                    <Controller
                      name={name}
                      rules={{
                        required: REQUIRED_MSG,
                      }}
                      render={({ field }) => (
                        <div className='flex flex-row w-full'>
                          {queryEstados.data?.map((item) => (
                            <div
                              role='button'
                              key={item.value.codigo}
                              className={classNames(
                                "border-1 border-gray-500 border-round text-center flex flex-column justify-content-center mx-1 font-bold cursor-pointer",
                                `estado-id-${item.value.codigo}`
                              )}
                              style={{
                                width: "3rem",
                                height: "3rem",
                                backgroundColor: item.value.color,
                                color: item.value.colorLetra,
                              }}
                              data-pr-tooltip={item.label}
                              data-pr-position='right'
                              data-pr-at='right+5 top'
                              data-pr-my='left center-2'
                              onClick={() => field.onChange(item.value.id)}>
                              <Tooltip target={`.estado-id-${item.value.codigo}`} />
                              {item.value.codigo}
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  )}
                />
              </div>

              <div className='col-12 grid grid-nogutter justify-content-between'>
                <div className='field col-12 sm:col-4 md:col-3 lg:col-3'>
                  <FormFieldRender
                    label='Fecha:'
                    name='fecha'
                    render={({ name }) => (
                      <DateInput
                        controller={{
                          name,
                          rules: {
                            required: REQUIRED_MSG,
                          },
                        }}
                        minDate={subDays(new Date(), 10)}
                        block
                        maxDate={addMonths(new Date(), 3)}
                      />
                    )}
                  />
                </div>
                <div className='field col-5 sm:col-4 md:col-3 lg:col-3'>
                  <FormFieldRender
                    label='Hora inicio:'
                    name='horaInicio'
                    render={({ name }) => (
                      <TimePicker
                        controller={{
                          name,
                          rules: {
                            required: REQUIRED_MSG,
                            onChange: (evt) => {
                              console.log("ON CHANGE: ", evt?.target?.value);
                            },
                          },
                        }}
                        block
                        datePicker={{
                          placeholderText: "SELECCIONE...",
                          timeIntervals: 60,
                        }}
                      />
                    )}
                  />
                </div>
                <div className='field col-5 sm:col-4 md:col-3 lg:col-3'>
                  <FormFieldRender
                    label='Hora fin:'
                    name='horaFin'
                    render={({ name }) => (
                      <TimePicker
                        controller={{
                          name,
                          rules: {
                            required: REQUIRED_MSG,
                            min: {
                              value: horaInicio,
                              message: "La hora de fin debe ser mayor a la hora de inicio",
                            },
                          },
                        }}
                        block
                        datePicker={{
                          placeholderText: "SELECCIONE...",
                          disabled: !!!horaInicio,
                          timeIntervals: 60,
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className='field col-12'>
                <label htmlFor='notas'>Notas:</label>
                <TextArea controller={{ name: "notas" }} block rows={5} />
              </div>
            </div>
          </Loading>
        </Dialog>
      )}
    </FormProvider>
  );
});

export default CitaModal;
