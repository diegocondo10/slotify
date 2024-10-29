import { Column } from "primereact/column";

const IndexColumn = (props = null) => {
  return (
    <Column
      header='#'
      className='text-center font-bold'
      body={(_, { rowIndex }) => {
        return rowIndex + 1;
      }}
    />
  );
};

export default IndexColumn;
