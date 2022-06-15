import { FlexProps } from "styled-system";
import { ReactElement } from "react";

export const variants = {
  DEFAULT: "default",
  WARNING: "warning",
  DANGER: "danger",
  PENDING: "pending",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface UserMenuProps extends FlexProps {
  account?: string;
  text?: string;
  avatarSrc?: string;
  variant?: Variant;
  children?: (exposedProps: { isOpen: boolean }) => ReactElement;
}

export interface UserMenuItemProps {
  disabled?: boolean;
}
