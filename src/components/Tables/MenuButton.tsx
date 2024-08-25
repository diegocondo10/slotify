import { PrimeIcons } from "primereact/api";
import { MenuItem } from "primereact/menuitem";
import { TieredMenu } from "primereact/tieredmenu";
import React, { useRef } from "react";
import Button from "../Buttons/Button";

export interface ButtonMenuProps {
  label?: string;
  icon?: string;
  items?: MenuItem[];
}

const ButtonMenu: React.FC<ButtonMenuProps> = ({ icon = PrimeIcons.COG, label, items = [] }) => {
  const ref = useRef<TieredMenu>(null);
  return (
    <React.Fragment>
      <TieredMenu popup id={label} ref={ref} model={items} />
      <Button label={label} icon={icon} onClick={(e) => ref.current.toggle(e)} outlined />
    </React.Fragment>
  );
};

export default ButtonMenu;
