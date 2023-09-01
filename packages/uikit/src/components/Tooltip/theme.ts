import { darkColors, lightColors } from "../../theme/colors";
import { vars } from "../../css/vars.css";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: lightColors.backgroundAlt,
  text: lightColors.text,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: darkColors.backgroundAlt,
  text: darkColors.text,
  boxShadow: vars.shadows.tooltip,
};
