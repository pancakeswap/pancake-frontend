import { HTMLAttributes, ImgHTMLAttributes, ReactElement } from "react";
import { SpaceProps } from "styled-system";
import { BoxProps } from "../Box";

export interface WrapperProps extends SpaceProps, HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
}

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "objectFit">,
    Omit<BoxProps, keyof ImgHTMLAttributes<HTMLImageElement>> {
  width: number;
  height: number;
  wrapperProps?: WrapperProps;
}

export interface BackgroundImageProps extends ImageProps {
  loadingPlaceholder?: ReactElement;
}

export const variants = {
  DEFAULT: "default",
  INVERTED: "inverted",
} as const;

export type Variant = typeof variants[keyof typeof variants];

export interface TokenPairImageProps extends BoxProps {
  primarySrc: string;
  secondarySrc: string;
  variant?: Variant;
  height: number;
  width: number;
  primaryImageProps?: Omit<ImageProps, "width" | "height">;
  secondaryImageProps?: Omit<ImageProps, "width" | "height">;
}
