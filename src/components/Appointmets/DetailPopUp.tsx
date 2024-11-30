"use client";
import { CrudActions } from "@/emuns/crudActions";
import useToasts from "@/hooks/useToasts";
import { CitaService } from "@/services/citas/citas.service";
import { EstadoCitaService } from "@/services/citas/estadoCita.service";
import { PK } from "@/types/api";
import { getCurrentPathEncoded } from "@/utils/router";
import { EventImpl } from "@fullcalendar/core/internal";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useQuery } from "react-query";
import Button from "../Buttons/Button";
import DeleteRecordConfirm from "../DeleteRecordConfirm";
import RecordDetail from "../DeleteRecordConfirm/RecordDetail";
import useDeleteRecordConfirm from "../DeleteRecordConfirm/useDeleteRecordConfirm";
import Loading from "../Loading";

export interface DetailPopUpHandle {
  toggle: (
    citaId: PK,
    event?: React.SyntheticEvent | null,
    target?: HTMLElement | EventTarget | null
  ) => void;
  hide: () => void;
}

interface DetailPopUpProps {
  refetch: () => void;
}

const citaService = new CitaService();
const estadoService = new EstadoCitaService();

const DetailPopUp = forwardRef<DetailPopUpHandle, DetailPopUpProps>((props, ref) => {
  const router = useRouter();

  const { deleteRecordRef, deleteEvent } = useDeleteRecordConfirm();

  const queryEstados = useQuery(["estados_citas"], () => estadoService.listAsLabelValue());

  const toast = useToasts();

  const opRef = useRef<OverlayPanel>(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    toggle: async (citaId, event, target) => {
      setIsLoading(true);
      try {
        opRef.current.toggle(event, target);
        const res = await citaService.detail(citaId);
        setSelectedEvent(res);
      } catch (error) {
        console.log(error);
        toast.addErrorToast("Ha ocurrido un problema al momento de cargar el registro");
      }
      setIsLoading(false);
    },
    hide: () => {
      opRef.current.hide();
    },
  }));

  const handlePagar = async () => {
    opRef.current.hide();
    await citaService.pagar(selectedEvent.id);
    props.refetch();
  };

  const handleCambiarEstado = (pk: PK, idEstado: PK) => async () => {
    opRef.current.hide();
    await citaService.cambiarEstado(pk, idEstado);
    props.refetch();
  };

  return (
    <>
      <DeleteRecordConfirm
        ref={deleteRecordRef}
        messageDetail={(record) => (
          <RecordDetail
            title='¿Estas seguro de eliminar esta cita?'
            items={[
              ["Paciente", record.title],
              [
                "Estado",
                <Tag
                  key={record.id}
                  style={{
                    backgroundColor: record.backgroundColor,
                    color: record.textColor,
                  }}>
                  {record.estadoLabel}
                </Tag>,
              ],
              ["Fecha", format(record.start, "dd/MM/yyy")],
              [
                "Hora",
                <div key={record.id}>
                  {format(record.start, "hh:mm a")} {" - "}
                  {format(record.end, "hh:mm a")}
                </div>,
              ],
              ["Notas", record?.notas],
              ["Tareas", record?.tareas],
            ]}
          />
        )}
        onAccept={async (record: EventImpl) => {
          await citaService.delete(record.id);
          props.refetch();
          toast.addSuccessToast("Se ha eliminado la cita correctamente");
        }}
      />
      <OverlayPanel style={{ minWidth: "25rem", maxWidth: "30rem" }} ref={opRef} dismissable>
        {isLoading && <Loading loading />}
        {selectedEvent && !isLoading && (
          <div className='flex flex-column'>
            <div className='flex flex-row align-items-center'>
              <h4 className='m-0'>{selectedEvent.title}</h4>
              <div className='flex flex-row w-8rem justify-content-around'>
                <Button
                  className='mx-1'
                  sm
                  variant='info'
                  icon={PrimeIcons.PENCIL}
                  rounded
                  onClick={() => {
                    const goBackTo = getCurrentPathEncoded();
                    router.push(
                      `/dashboard/cita?action=${CrudActions.UPDATE}&id=${selectedEvent.id}&goBackTo=${goBackTo}`
                    );
                  }}
                />
                <Button
                  className='mx-1'
                  sm
                  variant='success'
                  icon={PrimeIcons.DOLLAR}
                  rounded
                  onClick={handlePagar}
                  outlined={selectedEvent?.isPagada === false}
                />
                <Button
                  className='mx-1'
                  sm
                  variant='danger'
                  icon={PrimeIcons.TRASH}
                  rounded
                  disabled={selectedEvent.isPagada}
                  onClick={deleteEvent(selectedEvent)}
                />
              </div>
            </div>
            <div>
              <Tag
                style={{
                  backgroundColor: selectedEvent.backgroundColor,
                  color: selectedEvent.textColor,
                }}>
                {selectedEvent.estadoLabel}
              </Tag>
            </div>
            {selectedEvent.isPagada && (
              <div>
                <Tag>Pagada</Tag>
              </div>
            )}

            <div className='flex flex-row my-2 mx-auto'>
              {queryEstados.data?.map((estado) => (
                <div
                  role='button'
                  key={estado.value.codigo}
                  className='border-1 border-gray-500 border-round text-center flex flex-column justify-content-center mx-1 font-bold cursor-pointer'
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    backgroundColor: estado.value.color,
                    color: estado.value.colorLetra,
                  }}
                  onClick={handleCambiarEstado(selectedEvent.id, estado.value.id)}>
                  {estado.value.codigo}
                </div>
              ))}
            </div>

            <p className='my-1'>
              <strong>Fecha:</strong> {format(selectedEvent.start, "dd/MM/yyy")}
            </p>
            <p className='my-1'>
              <strong>Hora:</strong> {format(selectedEvent.start, "hh:mm a")} {" - "}
              {selectedEvent?.end && format(selectedEvent?.end, "hh:mm a")}
            </p>
            {selectedEvent.hasNotas && (
              <p className='my-1'>
                <strong>Notas:</strong> {selectedEvent?.notas}
              </p>
            )}
            {selectedEvent.hasTareas && (
              <p className='my-1'>
                <strong>Tareas:</strong> {selectedEvent?.tareas}
              </p>
            )}
          </div>
        )}
      </OverlayPanel>
    </>
  );
});

DetailPopUp.displayName = "DetailPopUp";

export default DetailPopUp;
