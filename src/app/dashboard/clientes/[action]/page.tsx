"use client";
import Button from "@/components/Buttons/Button";
import DateInput from "@/components/Forms/DateInput";
import DropDown from "@/components/Forms/DropDown";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import TextInput from "@/components/Forms/TextInput";
import Loading from "@/components/Loading";
import PageTitle from "@/components/pages/PageTitle";
import { REQUIRED_MSG } from "@/constants/rules";
import useCreateUpdate from "@/hooks/useCreateUpdate";
import useToasts from "@/hooks/useToasts";
import { ClienteService } from "@/services/clientes/clientes.service";
import { toBackDate, toFrontDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";

const ClientesForm = ({ params, searchParams }) => {
  const id = searchParams.id;

  const methods = useForm({
    mode: "onChange",
  });

  const retrieveQuery = useQuery(["cliente", id], () => new ClienteService().retrieve(id), {
    enabled: !!id,
    onSuccess: ({ data }) => {
      data.fechaNacimiento = toFrontDate(data.fechaNacimiento);
      methods.reset(data);
    },
  });

  const router = useRouter();

  const toast = useToasts();

  const mutation = useCreateUpdate({
    action: params.action,
    methods,
    create: (formData) => new ClienteService().create(formData),
    update: (formData) => new ClienteService().update(searchParams.id, formData),
    onSuccess: () => {
      toast.addSuccessToast("Se guardado la información correctamente");
      router.push("/dashboard/clientes");
    },
  });

  const onSubmit = async (formData) => {
    formData.fechaNacimiento = toBackDate(formData.fechaNacimiento);
    await mutation.submitForm(formData);
  };

  return (
    <FormProvider {...methods}>
      <Loading loading={retrieveQuery.isFetching || mutation.isLoading}>
        <div className='grid grid-nogutter justify-content-center'>
          <div className='col-12'>
            <PageTitle>Cliente</PageTitle>
          </div>

          <Card
            className='col-11 md:col-10 lg:col-8 xl:col-6'
            footer={
              <div className='grid grid-nogutter justify-content-around mb-5'>
                <div className='col-5'>
                  <Button block label='Regresar' variant='info' href='/dashboard/clientes' />
                </div>
                <div className='col-5'>
                  <Button block label='Guardar' onClick={methods.handleSubmit(onSubmit)} />
                </div>
              </div>
            }>
            <div className='col-12 grid grid-nogutter justify-content-between p-5'>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='tipoIdentificacion'
                  label='Tipo de identificación'
                  render={({ name }) => (
                    <DropDown
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                      block
                      options={[
                        {
                          label: "CÉDULA",
                          value: "CEDULA",
                        },
                      ]}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='identificacion'
                  label='Identificación'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='firstName'
                  label='Primer nombre'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='secondName'
                  label='Segundo nombre'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='lastName'
                  label='Primer apellido'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='secondLastName'
                  label='Segundo apellido'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='telefono'
                  label='Teléfono'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='email'
                  label='Correo'
                  render={({ name }) => (
                    <TextInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                      type='email'
                    />
                  )}
                />
              </div>

              <div className='field col-12 md:col-5'>
                <FormFieldRender
                  name='fechaNacimiento'
                  label='Fecha de nacimiento'
                  render={({ name }) => (
                    <DateInput
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>

              <div className='field col-12'>
                <FormFieldRender
                  name='direccion'
                  label='Dirección'
                  render={({ name }) => (
                    <TextArea
                      block
                      controller={{
                        name,
                        rules: {
                          required: REQUIRED_MSG,
                        },
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </Card>
        </div>
      </Loading>
    </FormProvider>
  );
};

export default ClientesForm;
