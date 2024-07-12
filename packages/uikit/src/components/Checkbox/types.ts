import { PancakeTheme } from "../../theme";

export const scales = {
  XS: "xs",
  SM: "sm",
  MD: "md",
} as const;

export type Scales = (typeof scales)[keyof typeof scales];

export interface CheckboxProps {
  scale?: Scales | string;
  colors?: {
    background?: keyof PancakeTheme["colors"];
    checkedBackground?: keyof PancakeTheme["colors"];
    checkedColor?: keyof PancakeTheme["colors"];
    border?: keyof PancakeTheme["colors"];
  };
  indeterminate?: boolean;
}
