import { ButtonTheme } from "../components/Button/types";
import { CardTheme } from "../components/Card/types";
import { ToggleTheme } from "../components/Toggle/types";
import { NavTheme } from "../widgets/Nav/types";
import { ModalTheme } from "../widgets/Modal/types";
import { Colors, Breakpoints, MediaQueries, Spacing, Shadows, Radii, ZIndices } from "./types";

export interface PancakeTheme {
  siteWidth: number;
  isDark: boolean;
  colors: Colors;
  button: ButtonTheme;
  card: CardTheme;
  nav: NavTheme;
  modal: ModalTheme;
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
