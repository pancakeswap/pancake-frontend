import { vars } from "../../css/vars.css";
import { darkColors, lightColors } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: lightColors.contrast,
  text: lightColors.background,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: darkColors.contrast,
  text: darkColors.background,
  boxShadow: vars.shadows.tooltip,
};
