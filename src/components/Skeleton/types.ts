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

export interface SkeletonProps {
  animation?: Animation;
  variant?: Variant;
  width?: number;
  height?: number;
}
