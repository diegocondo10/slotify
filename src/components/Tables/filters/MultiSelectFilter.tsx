import { ColumnFilterElementTemplateOptions } from 'primereact/column';
import { MultiSelect, MultiSelectProps } from 'primereact/multiselect';
import React from 'react';

interface MultiSelectFilterProps extends MultiSelectProps {
  filterProps: ColumnFilterElementTemplateOptions;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ value, options, loading, filterProps, ...rest }) => {
  return (
    <MultiSelect
      filter
      className="w-full"
      placeholder="Seleccione"
      maxSelectedLabels={0}
      selectedItemsLabel="{} items"
      options={options}
      loading={loading}
      disabled={loading}
      {...rest}
      value={filterProps.value}
      onChange={(e) => filterProps.filterApplyCallback(e.value)}
    />
  );
};

export default MultiSelectFilter;
