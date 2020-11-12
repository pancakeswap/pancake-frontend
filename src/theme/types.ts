import { ButtonTheme } from "../components/Button/types";
import { CardTheme } from "../components/Card/types";
import { TagTheme } from "../components/Tag/types";
import { ToggleTheme } from "../components/Toggle/types";
import { NavTheme } from "../widgets/Nav/types";

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  nav: string;
};

export type Spacing = number[];

export type Radii = {
  small: string;
  default: string;
  card: string;
  circle: string;
};

export type Shadows = {
  level1: string;
  active: string;
  success: string;
  warning: string;
  focus: string;
  inset: string;
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

export type ZIndices = {
  dropdown: number;
  modal: number;
};

export interface PancakeTheme {
  siteWidth: number;
  isDark: boolean;
  colors: Colors;
  button: ButtonTheme;
  card: CardTheme;
  tag: TagTheme;
  nav: NavTheme;
  toggle: ToggleTheme;
  breakpoints: Breakpoints;
  mediaQueries: MediaQueries;
  spacing: Spacing;
  shadows: Shadows;
  radii: Radii;
  zIndices: ZIndices;
}
