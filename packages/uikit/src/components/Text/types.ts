import { PropsWithChildren } from "react";
import { LayoutProps, SpaceProps, TypographyProps } from "styled-system";

export interface TextBaseProps extends SpaceProps, TypographyProps, LayoutProps {
  color?: string;
  bold?: boolean;
  small?: boolean;
  ellipsis?: boolean;
  strikeThrough?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

export type TextProps = PropsWithChildren<TextBaseProps>;
