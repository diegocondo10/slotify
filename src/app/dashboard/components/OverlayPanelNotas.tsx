"use client";
import Button from "@/components/Buttons/Button";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import Loading from "@/components/Loading";
import { NotaService } from "@/services/notas/notas.service";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dispatch, MutableRefObject, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";

const notasService = new NotaService();

const OverlayPanelNotas = ({
  refOp,
  selectedDateHeader,
  setSelectedDateHeader,
  refetchNotas,
}: {
  refOp: MutableRefObject<OverlayPanel>;
  selectedDateHeader: string;
  setSelectedDateHeader: Dispatch<SetStateAction<string>>;
  refetchNotas: () => void;
}) => {
  const methods = useForm({ mode: "onChange" });
  const [guardando, setGuardando] = useState(false);

  const queryNota = useQuery(
    [selectedDateHeader, "nota"],
    () => notasService.oneByDate(selectedDateHeader),
    {
      enabled: selectedDateHeader !== null,
      onSuccess: (data) => {
        methods.reset(data);
      },
    }
  );

  const onSubmit = async (formData) => {
    setGuardando(true);
    console.log(formData);
    await notasService.creteOrUpdate(selectedDateHeader, { descripcion: formData.descripcion });
    // setSelectedDateHeader(null);
    setGuardando(false);
    refetchNotas();
  };

  return (
    <OverlayPanel className='mx-auto' style={{ maxWidth: "30rem", minWidth: "20rem" }} ref={refOp}>
      {queryNota.isFetching && <Loading loading />}

      {!queryNota.isFetching && (
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
};

export default OverlayPanelNotas;
