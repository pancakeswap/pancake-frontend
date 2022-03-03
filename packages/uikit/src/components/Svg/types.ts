/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType, SVGAttributes } from "react";
import { DefaultTheme } from "styled-components";
import { SpaceProps } from "styled-system";
import { Colors } from "../../theme";

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  theme?: DefaultTheme;
  spin?: boolean;
}

export type IconComponentType = {
  icon: ElementType<any>;
  fillIcon?: ElementType<any>;
  isActive?: boolean;
  height?: string;
  width?: string;
  activeColor?: string;
  activeBackgroundColor?: keyof Colors;
} & SvgProps;
