import { ReactElement, ReactNode } from "react";
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
  text?: ReactNode;
  avatarSrc?: string;
  variant?: Variant;
  disabled?: boolean;
  children?: (exposedProps: { isOpen: boolean }) => ReactElement;
}

export interface UserMenuItemProps {
  disabled?: boolean;
}
