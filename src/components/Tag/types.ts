import { ReactNode } from "react";
import { SpaceProps } from "styled-system";

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  TEXTDISABLED: "textDisabled",
  TEXTSUBTLE: "textSubtle",
  BINANCE: "binance",
  FAILURE: "failure",
} as const;

export type Variants = typeof variants[keyof typeof variants];

export interface TagProps extends SpaceProps {
  variant?: Variants;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  outline?: boolean;
}
