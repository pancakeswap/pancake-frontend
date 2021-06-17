import { HTMLAttributes, ImgHTMLAttributes } from "react";
import { SpaceProps } from "styled-system";
import { BoxProps } from "../Box";

export interface WrapperProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
}

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, SpaceProps {
  width: number;
  height: number;
  wrapperProps?: WrapperProps;
}

export interface TokenImageBaseProps extends Omit<ImageProps, "src"> {
  baseUrl?: string;
  imageFormat?: string;
}

export const variants = {
  DEFAULT: "default",
  INVERTED: "inverted",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface TokenPairImageProps extends BoxProps {
  primaryTokenAddress: string;
  secondaryTokenAddress: string;
  variant?: Variant;
  height: number;
  width: number;
  primaryImageProps?: Omit<TokenImageBaseProps, "width" | "height">;
  secondaryImageProps?: Omit<TokenImageBaseProps, "width" | "height">;
}

export interface TokenImageProps extends TokenImageBaseProps {
  tokenAddress: string;
}
