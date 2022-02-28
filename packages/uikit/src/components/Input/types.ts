import { ReactElement } from "react";
import { SpaceProps } from "styled-system";

export const scales = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type Scales = typeof scales[keyof typeof scales];

export interface InputProps extends SpaceProps {
  scale?: Scales;
  isSuccess?: boolean;
  isWarning?: boolean;
}

export interface InputGroupProps extends SpaceProps {
  scale?: Scales;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  children: JSX.Element;
}
