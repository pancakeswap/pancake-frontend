export const variants = {
  ROUND: "round",
  FLAT: "flat",
} as const;

export const scales = {
  MD: "md",
  SM: "sm",
} as const;

export type Scale = typeof scales[keyof typeof scales];

export type Variant = typeof variants[keyof typeof variants];

export interface ProgressProps {
  variant?: Variant;
  scale?: Scale;
  primaryStep?: number;
  secondaryStep?: number;
  showProgressBunny?: boolean;
  useDark?: boolean;
}
