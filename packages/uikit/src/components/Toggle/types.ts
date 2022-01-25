import { InputHTMLAttributes, ReactNode } from "react";
import { Colors } from "../../theme";

export const scales = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type Scales = typeof scales[keyof typeof scales];

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  scale?: Scales;
  checked?: boolean;
  checkedColor?: keyof Colors;
  defaultColor?: keyof Colors;
  startIcon?: (isActive?: boolean) => ReactNode;
  endIcon?: (isActive?: boolean) => ReactNode;
}

export interface HandleProps {
  scale: Scales;
}

export interface InputProps {
  scale: Scales;
}

export interface StyleToggleProps {
  $checked: boolean;
  $checkedColor: keyof Colors;
  $defaultColor: keyof Colors;
  scale: Scales;
}

export const scaleKeys = {
  handleHeight: "handleHeight",
  handleWidth: "handleWidth",
  handleLeft: "handleLeft",
  handleTop: "handleTop",
  checkedLeft: "checkedLeft",
  toggleHeight: "toggleHeight",
  toggleWidth: "toggleWidth",
} as const;

export type ScaleKeys = typeof scaleKeys[keyof typeof scaleKeys];
