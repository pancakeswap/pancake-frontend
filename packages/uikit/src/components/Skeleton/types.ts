import { LayoutProps, SpaceProps } from "styled-system";

export const animation = {
  WAVES: "waves",
  PULSE: "pulse",
} as const;

export const variant = {
  RECT: "rect",
  CIRCLE: "circle",
} as const;

export type Animation = typeof animation[keyof typeof animation];
export type Variant = typeof variant[keyof typeof variant];

export interface SkeletonProps extends SpaceProps, LayoutProps {
  animation?: Animation;
  variant?: Variant;
}

export interface SkeletonV2Props extends SpaceProps, LayoutProps {
  animation?: Animation;
  variant?: Variant;
  isDataReady?: boolean;
  wrapperProps?: SpaceProps & LayoutProps;
  skeletonTop?: string;
  skeletonLeft?: string;
}
