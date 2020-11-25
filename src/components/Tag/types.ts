import { ReactNode } from "react";

export const variants = {
  PINK: "pink",
  PURPLE: "purple",
  GREEN: "green",
  GRAY: "gray",
} as const;

export type Variants = typeof variants[keyof typeof variants];

export type TagThemeVariant = {
  background: string;
  color: string;
  colorOutline: string;
  borderColorOutline: string;
};

export type TagTheme = {
  [key in Variants]: TagThemeVariant;
};

export interface TagProps {
  variant?: Variants;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  outline?: boolean;
}
