import { InputHTMLAttributes } from "react";

export type ToggleTheme = {
  handleBackground: string;
};

export const scales = {
  SM: "sm",
  MD: "md",
} as const;

export type Scales = typeof scales[keyof typeof scales];

export interface ToggleProps {
  scale: Scales;
  checked?: boolean;
}

export interface HandleProps {
  scale: Scales;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
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
