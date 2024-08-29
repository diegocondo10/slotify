"use client";
import Button from "@/components/Buttons/Button";
import DateInput from "@/components/Forms/DateInput";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import TimePicker from "@/components/Forms/TimePicker";
import Loading from "@/components/Loading";
import PageTitle from "@/components/pages/PageTitle";
import { REQUIRED_MSG } from "@/constants/rules";
import { CrudActions } from "@/emuns/crudActions";
import useCreateUpdate from "@/hooks/useCreateUpdate";
import useToasts from "@/hooks/useToasts";
import { CitaService } from "@/services/citas/citas.service";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { ClienteService } from "@/services/clientes/clientes.service";
import { formatToTimeString, toBackDate, toFrontDate } from "@/utils/date";
import classNames from "classnames";
import { addMonths, setHours, subDays } from "date-fns";
import { addHours } from "date-fns/addHours";
import { keyBy } from "lodash";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useEffect, useMemo, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import CreatableSelect from "react-select/creatable";

const today = new Date();

const CitaPage = ({ searchParams }) => {
  const [loading, setLoading] = useState(true);
  const [estadosIndexed, setEstadosIndexed] = useState<Record<string, any>>({});
  const [pacientesIndex, setPacientesIndex] = useState<Record<string, any>>({});
  const [estados, setEstados] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const action = searchParams.action;

  const isCreate = action === CrudActions.CREATE;
  const isUpdate = action === CrudActions.UPDATE;

  const id = searchParams.id;

  const methods = useForm<any>({
    mode: "onChange",
  });

  const router = useRouter();

  const toast = useToasts();

  useEffect(() => {
    if (isCreate) {
      const fecha = new Date(searchParams.fecha);
      methods.reset({
        fecha,
        horaInicio: fecha,
        horaFin: addHours(fecha, 1),
      });
      setLoading(false);
    }
  }, []);

  const queryEstados = useQuery(
    ["estados_citas"],
    () => new EstadoCitaService().listAsLabelValue(),
    {
      onSuccess: (data) => {
        if (isCreate) {
          setEstados(data.filter((item) => item.value.showOnCreate));
          const estadoDefault = data.find((item) => item.value.isDefaultForCreate);
          methods.setValue("estado", estadoDefault.value.id);
        } else {
          setEstados(data.filter((item) => item.value.showOnUpdate));
        }
        setEstadosIndexed(keyBy(data, "value.id"));
      },
    }
  );

  const queryClientes = useQuery(
    ["clientes_list_label_value"],
    () => new ClienteService().listAsLabelValue(),
    {
      onSuccess: (data) => {
        setPacientes(data);
        setPacientesIndex(keyBy(data, "value"));
      },
    }
  );

  useQuery(["cita", id], () => new CitaService().retrieve(id), {
    enabled: !!id && isUpdate && queryClientes.isFetching === false,
    onSuccess: ({ data }) => {
      data.fecha = toFrontDate(data.fecha);
      data.horaInicio = toFrontDate(data.horaInicio);
      data.horaFin = toFrontDate(data.horaFin);
      methods.reset({
        ...data,
        cliente: pacientesIndex[data.cliente],
      });
      setLoading(false);
    },
  });

  const mutation = useCreateUpdate({
    action,
    methods,
    create: (formData) => new CitaService().create(formData),
    update: (formData) => new CitaService().update(id, formData),
  });

  const isLoading =
    loading || queryEstados.isFetching || queryClientes.isFetching || mutation.isLoading;

  const horaInicio = methods.watch("horaInicio");

  const estadoForm = methods.watch("estado");

  const estado = useMemo(() => estadosIndexed?.[estadoForm] || null, [estadoForm, estadosIndexed]);

  const onSubmit = async (formData) => {
    try {
      formData.fecha = toBackDate(formData.fecha);
      formData.horaInicio = formatToTimeString(formData.horaInicio);
      formData.horaFin = formatToTimeString(formData.horaFin);
      formData.cliente = formData.cliente.value;
      console.log("FORM DATA: ", formData);
      await mutation.submitForm(formData);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateNewPaciente = async (inputValue: string) => {
    setIsCreating(true);
    try {
      const response = await new ClienteService().createBasic(inputValue);
      const newCliente = {
        label: response.fullName,
        value: response.id,
      };
      methods.setValue("cliente", newCliente);
      setPacientes([newCliente, ...pacientes]);
    } catch (error) {
      toast.addErrorToast("Ha ocurrido un problema al momento de crear el nuevo paciente");
    }
    setIsCreating(false);
  };

  return (
    <FormProvider {...methods}>
      <Loading loading={isLoading}>
        <div className='grid grid-nogutter justify-content-center'>
          <div className='col-12'>
            <PageTitle>
              {isCreate && "Agendar nueva cita"}
              {isUpdate && "Editar cita"}
            </PageTitle>
          </div>
          <div className='col-11 md:col-10 lg:col-8'>
            <Card
              className='p-5'
              footer={
                <div className='w-full flex flex-row justify-content-around'>
                  <Button
                    variant='info'
                    label='Regresar'
                    className='w-10rem'
                    loading={isLoading}
                    href='/dashboard'
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
              <div className='w-full grid grid-nogutter'>
                <div className='field col-12'>
                  <FormFieldRender
                    label='Paciente'
                    name='cliente'
                    render={({ name }) => (
                      <Controller
                        name={name}
                        rules={{
                          required: REQUIRED_MSG,
                        }}
                        render={({ field, fieldState }) => (
                          <CreatableSelect
                            className={classNames({
                              "border-1 border-red-600 border-round": fieldState.invalid,
                            })}
                            isDisabled={loading || isCreating}
                            onCreateOption={onCreateNewPaciente}
                            options={pacientes}
                            formatCreateLabel={(inputValue) => (
                              <p className='p-0 m-0'>
                                <strong>Crear: </strong>
                                {inputValue}
                              </p>
                            )}
                            value={field.value}
                            onChange={(evt) => {
                              field.onChange(evt);
                            }}
                            isLoading={isCreating}
                          />
                        )}
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
                            {estados?.map((item) => (
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
                                onClick={() => field.onChange(item.value.id)}>
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
                          inputClassName='font-bold text-center'
                          disabled
                          block
                          minDate={subDays(new Date(), 10)}
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
                                methods.setValue("horaFin", null);
                              },
                            },
                          }}
                          block
                          datePicker={{
                            placeholderText: "SELECCIONE...",
                            timeIntervals: 60,
                            disabled: true,
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
                            calendarClassName: "hide-disabled-times",
                            minTime: setHours(today, horaInicio?.getHours()),
                            maxTime: setHours(today, 22),
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
            </Card>
          </div>
        </div>
      </Loading>
    </FormProvider>
  );
};

export default CitaPage;
