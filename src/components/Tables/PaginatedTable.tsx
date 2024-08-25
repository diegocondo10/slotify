import { Column, ColumnProps } from "primereact/column";
import { DataTable, DataTableBaseProps, DataTableValueArray } from "primereact/datatable";
import { PropsWithChildren, PropsWithRef, forwardRef } from "react";

export interface PaginatedTableProps<TValue extends DataTableValueArray>
  extends PropsWithRef<PropsWithChildren<DataTableBaseProps<TValue>>> {
  showIndexColumn?: boolean;
  indexColumnProps?: ColumnProps;
}

const defaultProps: Partial<PaginatedTableProps<any>> = {
  rowHover: true,
  paginator: true,
  stripedRows: true,
  showGridlines: true,
  currentPageReportTemplate: "{currentPage} de {totalPages} | Registros totales {totalRecords}",
  paginatorTemplate: "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
  sortMode: "multiple",
  emptyMessage: "No se ha encontrado información",
  lazy: true,
  removableSort: true,
  responsiveLayout: "scroll",
  filterDisplay: "row",
  showIndexColumn: true,
  size: "small",
};

const PaginatedTable = forwardRef<DataTable<any>, PaginatedTableProps<any>>((props, ref) => {
  const { showIndexColumn = defaultProps.showIndexColumn, indexColumnProps, ...restProps } = props;

  const dataTableProps = { ...defaultProps, ...restProps };
  delete dataTableProps.showIndexColumn;

  return (
    <DataTable ref={ref} {...dataTableProps}>
      {showIndexColumn && (
        <Column
          header='#'
          className='text-center font-bold'
          body={(rowData, options) => options.rowIndex + 1}
          {...indexColumnProps}
        />
      )}
      {props.children}
    </DataTable>
  );
});

PaginatedTable.displayName = "PaginatedTable";

export default PaginatedTable;
