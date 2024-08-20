import { PARAMETROS } from '@/services/parametro/parametro.enum';
import { ParametroService } from '@/services/parametro/parametro.service';
import { AxiosError } from 'axios';
import { QueryObserverOptions, useQuery, UseQueryResult } from 'react-query';

export type ParametroRespuesta = {
  [key in PARAMETROS]: any;
};
/**
 * Opciones para el hook useParametros.
 */
export interface UseParametrosOptions {
  codigos: PARAMETROS[];
  queryProps?: QueryObserverOptions<ParametroRespuesta, AxiosError>;
}

/**
 * Hook para obtener múltiples parámetros por sus códigos.
 * @param {UseParametrosOptions} options - Opciones para el hook.
 * @returns {UseQueryResult<ParametroRespuesta, AxiosError>} Resultado del query.
 */
export const useParametros = ({
  codigos,
  queryProps,
}: UseParametrosOptions): UseQueryResult<ParametroRespuesta, AxiosError> => {
  const query = useQuery<ParametroRespuesta, AxiosError>(
    [codigos],
    ({ signal }) => ParametroService.findByCodigos(codigos, { signal }),
    {
      refetchOnWindowFocus: false,
      cacheTime: 36000,
      ...queryProps,
    },
  );
  return query;
};
