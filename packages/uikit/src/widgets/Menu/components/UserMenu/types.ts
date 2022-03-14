import { FlexProps } from "styled-system";

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
}

export interface UserMenuItemProps {
  disabled?: boolean;
}
