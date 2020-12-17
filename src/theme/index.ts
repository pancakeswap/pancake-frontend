import { AlertTheme } from "../components/Alert/types";
import { ButtonTheme } from "../components/Button/types";
import { CardTheme } from "../components/Card/types";
import { RadioTheme } from "../components/Radio/types";
import { ToggleTheme } from "../components/Toggle/types";
import { NavTheme } from "../widgets/Menu/types";
import { ModalTheme } from "../widgets/Modal/types";
import { Colors, Breakpoints, MediaQueries, Spacing, Shadows, Radii, ZIndices } from "./types";

export interface PancakeTheme {
  siteWidth: number;
  isDark: boolean;
  alert: AlertTheme;
  colors: Colors;
  button: ButtonTheme;
  card: CardTheme;
  nav: NavTheme;
  modal: ModalTheme;
  radio: RadioTheme;
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
