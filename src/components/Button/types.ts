import { ButtonHTMLAttributes, ReactNode } from "react";

export const sizes = {
  SM: "sm",
  MD: "md",
} as const;

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  TEXT: "text",
} as const;

export type Sizes = typeof sizes[keyof typeof sizes];
export type Variants = typeof variants[keyof typeof variants];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variants;
  size?: Sizes;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  as?: "a" | "button";
  href?: string;
}

export type ButtonThemeVariant = {
  background: string;
  backgroundActive: string;
  backgroundHover: string;
  border: string | number;
  borderColorHover: string;
  boxShadow: string;
  boxShadowActive: string;
  color: string;
};

export type ButtonTheme = {
  [key in Variants]: ButtonThemeVariant;
};
