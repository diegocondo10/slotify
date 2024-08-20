import { CSSProperties } from '@emotion/react/node_modules/@emotion/serialize';
import { DataTable, DataTableBaseProps, DataTableSortMeta } from 'primereact/datatable';
import React, { PropsWithRef } from 'react';

export interface TablaPaginadaProps extends PropsWithRef<Omit<DataTableBaseProps<any>, 'style' | 'ref'>> {
  style?: CSSProperties;
  onOrdering?: (e?: DataTableSortMeta[] | null | undefined) => void;
  onChangePage?: (page: number) => void;
}

const defaultProps: TablaPaginadaProps = {
  rowHover: true,
  paginator: true,

  stripedRows: true,
  showGridlines: true,
  currentPageReportTemplate: '{currentPage} de {totalPages} | Registros totales {totalRecords}',
  paginatorTemplate: 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
  sortMode: 'multiple',
  emptyMessage: 'No se ha encontrado información',
  lazy: true,
  removableSort: true,
  responsiveLayout: 'scroll',
};

const TablaPaginada: React.FC<TablaPaginadaProps> = React.forwardRef<DataTable<any>, TablaPaginadaProps>(
  (props, ref) => {
    const { onOrdering, onChangePage, ...rest } = props;
    return (
      <DataTable
        //
        onSort={(e) => onOrdering(e?.multiSortMeta)}
        onPage={(e) => onChangePage(e.page)}
        {...rest}
      >
        {props.children}
      </DataTable>
    );
  },
);

// TablaPaginada.defaultProps = defaultProps;
TablaPaginada.displayName = 'TablaPaginada';
export default TablaPaginada;
