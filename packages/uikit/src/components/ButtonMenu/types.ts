import { ReactElement } from "react";
import { ButtonProps } from "../Button/Button";

export type ButtonMenuItemProps = ButtonProps & {
  isActive?: boolean;
};

export type ButtonMenuProps = ButtonProps & {
  variant?: "primary" | "subtle";
  activeIndex?: number;
  onItemClick?: (index: number) => void;
  scale?: ButtonProps["scale"];
  disabled?: boolean;
  children: ReactElement[];
  fullWidth?: boolean;
};
