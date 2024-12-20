import API from "@/services/api";
import { simulateTouch } from "@/utils/events";
import { AxiosError, AxiosResponse } from "axios";
import debounce from "lodash/debounce";
import { getSession } from "next-auth/react";
import {
  DataTableBaseProps,
  DataTableFilterMeta,
  DataTableFilterMetaData,
  DataTableSortMeta,
} from "primereact/datatable";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { QueryKey, useQuery, UseQueryResult } from "react-query";

interface PaginationOptions {
  uri: string;
  key: QueryKey;
  defaultFilters?: DataTableFilterMeta;
}

interface BuildUrlParams {
  page: number;
  filters: DataTableFilterMeta;
  ordering: DataTableSortMeta[];
}

const buildSearch = ({ page, filters = {}, ordering }: BuildUrlParams): string => {
  const queryString = new URLSearchParams();
  if (ordering) {
    const orderString = ordering
      .map((sort) => `${sort.order === 1 ? "" : "-"}${sort.field}`)
      .join(",");
    if (orderString !== "") {
      queryString.append("ordering", orderString);
    }
  }
  if (page > 0) {
    queryString.append("page", String(page + 1));
  }

  Object.entries(filters).forEach(([key, value]: [string, DataTableFilterMetaData]) => {
    if (Array.isArray(value.value)) {
      value.value.forEach((item) => queryString.append(key, item));
    } else if (typeof value.value === "string" && value.value.trim() !== "") {
      queryString.append(key, value.value);
    }
  });

  const queryParams = queryString.toString();
  return queryParams ? `?${queryParams}` : "";
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
  searchUrl: string;
  page: number;
  setPage: (page: number) => void;
  filters: DataTableFilterMeta;
  setFilters: Dispatch<SetStateAction<DataTableFilterMeta>>;
  tableProps: DataTableBaseProps<any>;
  setFilterValue: (key: string, value: any) => void;
} => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [multiSortMeta, setMultiSortMeta] = useState([]);

  const [queryFilters, setQueryFilters] = useState<DataTableFilterMeta>(defaultFilters);

  const [token, setToken] = useState<string>(null);

  const [searchUrl, setSearchUrl] = useState("");
  const debouncedFilter = useCallback(
    debounce((newFilters) => {
      setQueryFilters(newFilters);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFilter(filters);
  }, [filters, debouncedFilter]);

  const query = useQuery<AxiosResponse<TData>, AxiosError>(
    [key, uri, page, queryFilters, multiSortMeta],
    async ({ signal }) => {
      const search = buildSearch({ page, filters: queryFilters, ordering: multiSortMeta });
      setSearchUrl(search);
      let internalToken = token;
      if (!internalToken) {
        const session = await getSession();
        if (session) {
          setToken(session.accessToken);
        }
        internalToken = session.accessToken;
      }

      return API.get<TData>(uri + search, {
        signal,
        headers: {
          Authorization: `Bearer ${internalToken}`,
        },
      });
    },
    {
      keepPreviousData: true,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      isDataEqual: () => false,
      onSuccess: () => {
        // simulateTouch();
      },
    }
  );

  const setFilterValue = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: {
        value: value,
        matchMode: null,
      },
    });
  };

  return {
    ...query,
    page,
    setPage,
    filters,
    setFilters,
    isQueryLoading: query.isLoading || query.isFetching,
    setFilterValue,
    searchUrl,
    tableProps: {
      onPage: (event) => {
        setPage(event.page);
      },
      onFilter: (event) => {
        setPage(0);
        setFilters(event.filters);
      },
      filters,
      dataKey: "id",
      first: page,
      loading: query.isLoading || query.isFetching,
      multiSortMeta: multiSortMeta,

      onSort: (event) => setMultiSortMeta(event.multiSortMeta),
      ...query.data?.data,
    },
  };
};

export default usePagination;
