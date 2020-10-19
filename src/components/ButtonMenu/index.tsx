import React, { cloneElement, Children, ReactElement } from "react";
import StyledButtonMenu from "./StyledButtonMenu";
import { sizes } from "../Button/types";
import { ButtonMenuProps, ButtonMenuItemProps } from "./types";

const ButtonMenu: React.FC<ButtonMenuProps> = ({ activeIndex = 0, size = sizes.MD, onClick, children }) => {
  return (
    <StyledButtonMenu>
      {Children.map(children, (child: ReactElement<ButtonMenuItemProps>, index) => {
        const handleClick = () => onClick && onClick(index);
        return cloneElement(child, { isActive: activeIndex === index, onClick: handleClick, size });
      })}
    </StyledButtonMenu>
  );
};

export default ButtonMenu;
