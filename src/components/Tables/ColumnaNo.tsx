import { Column } from 'primereact/column';
import React, { CSSProperties } from 'react';

const ColumnaNo = (props = null) => {
  return (
    <Column
      header="#"
      bodyClassName="text-center"
      headerClassName="text-center"
      style={{ width: props?.width } as CSSProperties}
      body={(_, rowData) => (
        <strong className="text-center" style={{ width: props?.width } as CSSProperties}>
          {
            //@ts-ignore
            rowData?.rowIndex + 1
          }
        </strong>
      )}
    />
  );
};

export default ColumnaNo;
