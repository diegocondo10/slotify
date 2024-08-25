import { Column, ColumnProps } from "primereact/column";
import { MenuItem } from "primereact/menuitem";
import ButtonMenu from "./MenuButton";

export interface ActionColumnProps extends ColumnProps {
  label?: string;
  icon?: string;
}

const ActionColumn = (
  items: (rowData: any) => MenuItem[],
  { label, icon, ...rest }: ActionColumnProps = {}
) => {
  return (
    <Column
      header='Acciones'
      bodyClassName='p-0 m-0 text-center'
      style={{ width: "100px" }}
      {...rest}
      body={(rowData) => <ButtonMenu items={items(rowData)} label={label} icon={icon} />}
    />
  );
};

export default ActionColumn;
