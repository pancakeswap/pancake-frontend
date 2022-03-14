import { ReactElement } from "react";
import { SpaceProps } from "styled-system";
import { BaseButtonProps, Scale, variants } from "../Button/types";

export interface ButtonMenuItemProps extends BaseButtonProps {
  isActive?: boolean;
}

export interface ButtonMenuProps extends SpaceProps {
  variant?: typeof variants.PRIMARY | typeof variants.SUBTLE;
  activeIndex?: number;
  onItemClick?: (index: number) => void;
  scale?: Scale;
  disabled?: boolean;
  children: ReactElement[];
  fullWidth?: boolean;
}
