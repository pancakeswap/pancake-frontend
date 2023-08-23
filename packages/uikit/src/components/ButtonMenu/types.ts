import { ReactElement } from "react";
import { SpaceProps } from "styled-system";
import { BaseButtonProps, Scale, variants } from "../Button/types";

export interface ButtonMenuItemProps extends BaseButtonProps {
  isActive?: boolean;
}

export interface ButtonMenuProps extends SpaceProps {
  variant?: typeof variants.PRIMARY | typeof variants.SUBTLE | typeof variants.LIGHT;
  activeIndex?: number;
  onItemClick?: (index: number, event: React.MouseEvent<HTMLElement>) => void;
  scale?: Scale;
  disabled?: boolean;
  children: ReactElement[];
  fullWidth?: boolean;
}
