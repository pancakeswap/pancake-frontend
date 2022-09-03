import { ReactElement } from "react";
import { BoxProps } from "../Box";

export const scales = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type Scales = typeof scales[keyof typeof scales];

export interface InputProps extends BoxProps {
  scale?: Scales;
  isSuccess?: boolean;
  isWarning?: boolean;
}

export interface InputGroupProps extends BoxProps {
  scale?: Scales;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  children: JSX.Element;
}
