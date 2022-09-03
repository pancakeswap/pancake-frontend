import React from "react";
import { FlexProps } from "../Box/Flex";
import BaseMenu from "./BaseMenu";
import { SubMenuContainer } from "./styles";
import { BaseMenuProps } from "./types";

const SubMenu: React.FC<React.PropsWithChildren<BaseMenuProps & FlexProps>> = ({
  children,
  component,
  options,
  isOpen = false,
  ...props
}) => {
  return (
    <BaseMenu component={component} options={options} isOpen={isOpen}>
      <SubMenuContainer {...props}>{children}</SubMenuContainer>
    </BaseMenu>
  );
};

export default SubMenu;
