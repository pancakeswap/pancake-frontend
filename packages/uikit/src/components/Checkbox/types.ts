export const scales = {
  XS: "xs",
  SM: "sm",
  MD: "md",
} as const;

export type Scales = (typeof scales)[keyof typeof scales];

export interface CheckboxProps {
  scale?: Scales;
}
