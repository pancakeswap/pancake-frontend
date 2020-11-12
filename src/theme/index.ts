import { ButtonTheme } from "../components/Button/types";
import { CardTheme } from "../components/Card/types";
import { TagTheme } from "../components/Tag/types";
import { ToggleTheme } from "../components/Toggle/types";
import { NavTheme } from "../widgets/Nav/types";
import { Colors, Breakpoints, MediaQueries, Spacing, Shadows, Radii, ZIndices } from "./types";

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

export { default as dark } from "./dark";
export { default as light } from "./light";

export { lightColors } from "./colors";
export { darkColors } from "./colors";
