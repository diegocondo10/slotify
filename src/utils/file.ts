import { ReportResponse } from "@/types/api";
import toast, { Renderable, ValueOrFunction } from "react-hot-toast";

export const downloadFile = (blob: BlobPart, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadReport = async <T extends ReportResponse = any>(
  service: Promise<ReportResponse>,
  loading: Renderable = "Descargando",
  success: ValueOrFunction<Renderable, T> = "Archivo descargado",
  error: ValueOrFunction<
    Renderable,
    any
  > = "Ha ocurrido un problema al momento de descargar el archivo"
): Promise<void> => {
  const _promise = async (): Promise<any> => {
    const response = await service;
    downloadFile(response.data, response.filename);
  };

  toast.promise<T>(
    _promise(),
    {
      loading,
      success,
      error,
    },
    {
      position: "bottom-right",
    }
  );
};
