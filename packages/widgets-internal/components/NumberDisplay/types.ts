import type { TextProps } from "@pancakeswap/uikit/src";
import type BigNumber from "bignumber.js";
import type { CSSProperties, ElementType, ReactNode } from "react";

export type CommonNumberDisplayProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: string | number | BigNumber;
  showFullDigitsTooltip?: boolean;
  as?: ElementType;
  style?: CSSProperties;
} & TextProps;
