"use client";
import Button from "@/components/Buttons/Button";
import FormFieldRender from "@/components/Forms/FormFieldRender";
import TextArea from "@/components/Forms/TextArea";
import { OverlayPanel } from "primereact/overlaypanel";
import { MutableRefObject } from "react";
import { FormProvider, useForm } from "react-hook-form";

const OverlayPanelNotas = ({ refOp }: { refOp: MutableRefObject<OverlayPanel> }) => {
  const methods = useForm({ mode: "onChange" });

  return (
    <OverlayPanel style={{ maxWidth: "30rem", minWidth: "20rem" }} ref={refOp}>
      <FormProvider {...methods}>
        <FormFieldRender
          label='Notas diarias: '
          name='notasDiarias'
          render={({ name }) => <TextArea controller={{ name }} block rows={5} />}
        />
        <Button block label='Guardar' />
      </FormProvider>
    </OverlayPanel>
  );
};

export default OverlayPanelNotas;
