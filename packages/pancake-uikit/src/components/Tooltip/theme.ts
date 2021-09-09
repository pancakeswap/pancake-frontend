import { shadows } from "../../theme/base";
import { darkColors, lightColors } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: darkColors.backgroundAlt,
  text: darkColors.text,
  boxShadow: shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: lightColors.backgroundAlt,
  text: lightColors.text,
  boxShadow: shadows.tooltip,
};
