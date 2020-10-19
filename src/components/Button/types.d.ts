import { ButtonHTMLAttributes, ReactNode } from "react";

export enum Variants {
  OUTLINE = "outline",
  TEXT = "text",
  SECONDARY = "secondary",
  PRIMARY = "primary",
}

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variants;
  size?: "md" | "sm";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
