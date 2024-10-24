import React, { ReactNode } from "react";
import { BoxProps } from "../Box";
import BaseMenu, { ChildrenFunctionProps } from "./BaseMenu";
import { InlineMenuContainer } from "./styles";
import { BaseMenuProps } from "./types";

const InlineMenu = ({
  children,
  component,
  isOpen = false,
  ...props
}: BaseMenuProps &
  Omit<BoxProps, "children"> & { children: ReactNode | ((props: ChildrenFunctionProps) => ReactNode) }) => {
  return (
    <BaseMenu options={{ placement: "bottom" }} component={component} isOpen={isOpen}>
      {({ toggle, open, close, update }) => (
        <InlineMenuContainer {...props}>
          {typeof children === "function" ? children({ toggle, open, close, update }) : children}
        </InlineMenuContainer>
      )}
    </BaseMenu>
  );
};

export default InlineMenu;
