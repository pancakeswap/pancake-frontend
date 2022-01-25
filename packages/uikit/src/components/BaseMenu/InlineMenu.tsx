import React from "react";
import { BoxProps } from "../Box";
import BaseMenu from "./BaseMenu";
import { InlineMenuContainer } from "./styles";
import { BaseMenuProps } from "./types";

const InlineMenu: React.FC<BaseMenuProps & BoxProps> = ({ children, component, isOpen = false, ...props }) => {
  return (
    <BaseMenu options={{ placement: "bottom" }} component={component} isOpen={isOpen}>
      <InlineMenuContainer {...props}>{children}</InlineMenuContainer>
    </BaseMenu>
  );
};

export default InlineMenu;
