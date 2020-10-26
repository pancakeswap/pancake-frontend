import "styled-components";
import { ButtonTheme } from "./components/Button/types";
import { CardTheme } from "./components/Card/types";
import { TagTheme } from "./components/Tag/types";

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

export type Shadows = {
  level1: string;
  active: string;
  success: string;
  warning: string;
};

export type Colors = {
  primary: string;
  primaryBright: string;
  primaryDark: string;
  secondary: string;
  tertiary: string;
  success: string;
  failure: string;
  contrast: string;
  input: string;
  background: string;
  backgroundDisabled: string;
  text: string;
  textDisabled: string;
  textSubtle: string;
};

declare module "styled-components" {
  export interface DefaultTheme {
    isDark: boolean;
    colors: Colors;
    button: ButtonTheme;
    card: CardTheme;
    tag: TagTheme;
    scales: {
      breakpoints: Breakpoints;
      mediaQueries: MediaQueries;
    };
    shadows: Shadows;
  }
}
