import { ButtonProps, Sizes } from "../Button/types";

export interface ButtonMenuItemProps extends ButtonProps {
  isActive?: boolean;
  size?: Sizes;
}

export interface ButtonMenuProps {
  activeIndex?: number;
  onClick?: (index: number) => void;
  size?: Sizes;
  children: React.ReactElement[];
}
