import { HTMLAttributes } from "react";
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  GridProps as _GridProps,
  ColorProps,
} from "styled-system";

export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    Omit<ColorProps, "color">,
    HTMLAttributes<HTMLElement> {}

export interface FlexProps extends BoxProps, FlexboxProps {}

export interface GridProps extends FlexProps, _GridProps {}
