"use client";
import Button from "@/components/Buttons/Button";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import Loading from "@/components/Loading";
import { NotaService } from "@/services/notas/notas.service";
import { OverlayPanel } from "primereact/overlaypanel";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const notasService = new NotaService();

interface OverlayPanelNotasProps {
  // refOp: MutableRefObject<OverlayPanel>;
  // selectedDateHeader: string;
  // setSelectedDateHeader: Dispatch<SetStateAction<string>>;
  refetchNotas: () => void;
}

const OverlayPanelNotas = forwardRef(({ refetchNotas }: OverlayPanelNotasProps, ref) => {
  const methods = useForm({ mode: "onChange" });
  const [guardando, setGuardando] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateHeader, setSelectedDateHeader] = useState(null);
  const refOp = useRef<OverlayPanel>(null);

  const onSubmit = async (formData) => {
    setGuardando(true);

    await notasService.creteOrUpdate(selectedDateHeader, { descripcion: formData.descripcion });
    setGuardando(false);
    refetchNotas();
  };

  useImperativeHandle(ref, () => ({
    fetchNota: async (event, date) => {
      refOp.current.toggle(event);
      setIsLoading(true);
      setSelectedDateHeader(date);
      const response = await notasService.oneByDate(date);
      methods.reset(response);
      setIsLoading(false);
    },
    hide: () => {
      refOp.current.hide();
    },
  }));

  return (
    <OverlayPanel className='mx-auto' style={{ maxWidth: "30rem", minWidth: "20rem" }} ref={refOp}>
      {isLoading && <Loading loading />}

      {!isLoading && (
        <FormProvider {...methods}>
          <FormFieldRender
            label='Notas diarias: '
            name='descripcion'
            render={({ name }) => (
              <TextArea
                className='my-2'
                disabled={guardando}
                controller={{ name }}
                block
                rows={20}
              />
            )}
          />
          <Button
            block
            label='Guardar'
            loading={guardando}
            onClick={methods.handleSubmit(onSubmit)}
          />
        </FormProvider>
      )}
    </OverlayPanel>
  );
});

OverlayPanelNotas.displayName = "OverlayPanelNotas";

export default OverlayPanelNotas;
