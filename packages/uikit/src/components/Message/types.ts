import React from "react";
import { SpaceProps } from "styled-system";

export const variants = {
  WARNING: "warning",
  DANGER: "danger",
  SUCCESS: "success",
  PRIMARY: "primary",
} as const;

export type Variant = (typeof variants)[keyof typeof variants];

export interface MessageProps extends SpaceProps {
  variant: Variant;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actionInline?: boolean;
}
