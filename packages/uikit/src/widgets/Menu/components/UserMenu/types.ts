import { ReactElement } from "react";
import { FlexProps } from "../../../../components/Box";

export const variants = {
  DEFAULT: "default",
  WARNING: "warning",
  DANGER: "danger",
  PENDING: "pending",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface UserMenuProps extends Omit<FlexProps, "children"> {
  account?: string;
  text?: string;
  avatarSrc?: string;
  variant?: Variant;
  ellipsis?: boolean;
  children?: (exposedProps: { isOpen: boolean }) => ReactElement;
}

export interface UserMenuItemProps {
  disabled?: boolean;
}
