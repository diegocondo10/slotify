import { ParametroService } from '@/services/parametro/parametro.service';
import { AxiosError } from 'axios';
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';

/**
 * Opciones para el hook useParametro.
 * @template TData - Tipo de datos esperado en la respuesta.
 */
export interface UseParametroOptions<TData = any> {
  codigo: string;
  queryProps?: QueryObserverOptions<TData, AxiosError>;
}

/**
 * Hook para obtener un parámetro por su código.
 * @template TData - Tipo de datos esperado en la respuesta.
 * @template TError - Tipo de error esperado en caso de fallo.
 * @param {UseParametroOptions<TData>} options - Opciones para el hook.
 * @returns {UseQueryResult<TData, TError>} Resultado del query.
 */
export const useParametro = <TData = any, TError extends AxiosError = AxiosError>({
  codigo,
  queryProps,
}: UseParametroOptions<TData>): UseQueryResult<TData, TError> => {
  const query = useQuery<TData, TError>([codigo], ({ signal }) => ParametroService.findByCodigo(codigo, { signal }), {
    refetchOnWindowFocus: false,
    cacheTime: 0,
    ...queryProps,
  });
  return query;
};
