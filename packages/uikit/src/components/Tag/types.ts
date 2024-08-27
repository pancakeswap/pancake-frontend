import { ReactNode } from "react";
import { SpaceProps, TypographyProps } from "styled-system";

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  TEXTDISABLED: "textDisabled",
  TEXTSUBTLE: "textSubtle",
  BINANCE: "binance",
  FAILURE: "failure",
  WARNING: "warning",
  GRADIENTBOLD: "gradientBold",
  SUCCESS_LOW_CONTRAST: "successLowContrast",
  FAILURE_LOW_CONTRAST: "failureLowContrast",
  TERTIARY: "tertiary",
  PRIMARY60: "primary60",
} as const;

export const scales = {
  MD: "md",
  SM: "sm",
} as const;

export type Scale = (typeof scales)[keyof typeof scales];
export type Variant = (typeof variants)[keyof typeof variants];

export interface TagProps extends SpaceProps, TypographyProps {
  variant?: Variant;
  scale?: Scale;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  outline?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
  style?: React.CSSProperties;
}
