"use client";

import Button from "@/components/Buttons/Button";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextInput from "@/components/Forms/TextInput";
import useToasts from "@/hooks/useToasts";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { FormProvider, useForm } from "react-hook-form";

export default function LoginPage() {
  const methods = useForm({
    mode: "onChange",
  });

  const toast = useToasts();

  const router = useRouter();

  const isSubmitting = methods.formState.isSubmitting;

  const handleSubmit = async (formData) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        ...formData,
      });

      if (response.ok) {
        return router.push("/dashboard");
      }
      toast.addErrorToast(
        "Ha ocurrido un problema al momento de procesar tu solicitud, por favor verifica tus credenciales"
      );
    } catch (error) {
      console.log(error);
      toast.addErrorToast(
        "Ha ocurrido un problema inesperado, por favor contactate con el administrador"
      );
    }
  };

  return (
    <main className='grid-container bg-green-200 h-screen'>
      <FormProvider {...methods}>
        <form
          className='flex align-items-center justify-content-center h-full'
          onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className='w-full w-10 sm:w-8 md:w-6 lg:w-5 xl:w-4 my-auto'>
            <h1 className='text-center'>Ingresar</h1>
            <div className='grid'>
              <div className='field col-12'>
                <FormFieldRender
                  label='Correo'
                  name='email'
                  render={(props) => (
                    <TextInput
                      block
                      controller={{ ...props }}
                      type='email'
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
              <div className='field col-12'>
                <FormFieldRender
                  label='Contraseña'
                  name='password'
                  render={(props) => (
                    <TextInput
                      block
                      controller={{ ...props }}
                      type='password'
                      disabled={isSubmitting}
                    />
                  )}
                />
              </div>
              <div className='field col-12'>
                <Button label='Ingresar' block type='submit' loading={isSubmitting} />
              </div>
            </div>
          </Card>
        </form>
      </FormProvider>
    </main>
  );
}
