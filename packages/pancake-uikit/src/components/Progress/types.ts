export const variants = {
  ROUND: "round",
  FLAT: "flat",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface ProgressProps {
  variant?: Variant;
  primaryStep?: number;
  secondaryStep?: number;
  showProgressBunny?: boolean;
}
