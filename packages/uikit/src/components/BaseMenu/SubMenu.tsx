import React from "react";
import { FlexProps } from "../Box";
import BaseMenu from "./BaseMenu";
import { SubMenuContainer } from "./styles";
import { BaseMenuProps } from "./types";

const SubMenu: React.FC<BaseMenuProps & FlexProps> = ({ children, component, options, isOpen = false, ...props }) => {
  return (
    <BaseMenu component={component} options={options} isOpen={isOpen}>
      <SubMenuContainer {...props}>{children}</SubMenuContainer>
    </BaseMenu>
  );
};

export default SubMenu;
