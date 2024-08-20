import API from '@/services/api';
import { AxiosError, AxiosResponse } from 'axios';
import debounce from 'lodash/debounce';
import {
  DataTableBaseProps,
  DataTableFilterMeta,
  DataTableFilterMetaData,
  DataTableSortMeta,
} from 'primereact/datatable';
import { useCallback, useEffect, useState } from 'react';
import { QueryKey, useQuery, UseQueryResult } from 'react-query';

interface PaginationOptions {
  uri: string;
  key: QueryKey;
  defaultFilters?: DataTableFilterMeta;
}

interface BuildUrlParams {
  url: string;
  page: number;
  filters: DataTableFilterMeta;
  ordering: DataTableSortMeta[];
}

const buildUrl = ({ url, page, filters = {}, ordering }: BuildUrlParams): string => {
  const queryString = new URLSearchParams();
  if (ordering) {
    const orderString = ordering.map((sort) => `${sort.order === 1 ? '' : '-'}${sort.field}`).join(',');
    if (orderString !== '') {
      queryString.append('ordering', orderString);
    }
  }
  if (page > 0) {
    queryString.append('page', String(page + 1));
  }

  Object.entries(filters).forEach(([key, value]: [string, DataTableFilterMetaData]) => {
    if (Array.isArray(value.value)) {
      value.value.forEach((item) => queryString.append(key, item));
    } else if (typeof value.value === 'string' && value.value.trim() !== '') {
      queryString.append(key, value.value);
    }
  });

  const queryParams = queryString.toString();
  return url + (queryParams ? `?${queryParams}` : '');
};

interface ResponseApi<T> {
  totalRecords: number;
  rows: number;
  first: number;
  value: T[];
}

const usePagination = <TData extends ResponseApi<any>>({
  uri,
  key,
  defaultFilters = {},
}: PaginationOptions): UseQueryResult<AxiosResponse<TData>, AxiosError> & {
  isQueryLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  filters: DataTableFilterMeta;
  setFilters: (filters: DataTableFilterMeta) => void;
  tableProps: DataTableBaseProps<any>;
} => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [multiSortMeta, setMultiSortMeta] = useState([]);

  const [queryFilters, setQueryFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const debouncedFilter = useCallback(
    debounce((newFilters) => {
      setQueryFilters(newFilters);
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedFilter(filters);
  }, [filters, debouncedFilter]);

  const query = useQuery<AxiosResponse<TData>, AxiosError>(
    [key, uri, page, queryFilters, multiSortMeta],
    async ({ signal }) => {
      const url = buildUrl({ url: uri, page, filters: queryFilters, ordering: multiSortMeta });
      return API.private().get<TData>(url, { signal });
    },
    {
      keepPreviousData: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      isDataEqual: () => false,
    },
  );

  return {
    ...query,
    page,
    setPage,
    filters,
    setFilters,
    isQueryLoading: query.isLoading || query.isFetching,
    tableProps: {
      onPage: (event) => {
        setPage(event.page);
      },
      onFilter: (event) => {
        setPage(0);
        setFilters(event.filters);
      },
      filters,
      dataKey: 'id',
      first: page,
      loading: query.isLoading || query.isFetching,
      multiSortMeta: multiSortMeta,
      onSort: (event) => setMultiSortMeta(event.multiSortMeta),
      ...query.data?.data,
    },
  };
};

export default usePagination;
