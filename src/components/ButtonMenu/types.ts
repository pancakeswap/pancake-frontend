import { ButtonProps, Sizes } from "../Button/types";

export type ButtonMenuItemProps = {
  isActive?: boolean;
  size?: Sizes;
} & ButtonProps;

export interface ButtonMenuProps {
  activeIndex?: number;
  onClick?: (index: number) => void;
  size?: Sizes;
  children: React.ReactElement[];
}
