import { ElementType, ReactNode } from "react";
import type { PolymorphicComponentProps } from "../../util/polymorphic";
import { BoxProps } from "../Box";
import type { Scale, Variant } from "./Button.css";

export const scales = {
  MD: "md",
  SM: "sm",
  XS: "xs",
} as const;

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  TEXT: "text",
  DANGER: "danger",
  SUBTLE: "subtle",
  SUCCESS: "success",
  LIGHT: "light",
} as const;

export type { Scale, Variant };

export interface BaseButtonProps extends BoxProps {
  as?: "a" | "button" | ElementType;
  asChild?: boolean;
  external?: boolean;
  isLoading?: boolean;
  scale?: Scale;
  variant?: Variant;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export type ButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<P, BaseButtonProps>;
