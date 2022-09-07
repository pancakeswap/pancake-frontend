import { vars } from "@pancakeswap/ui/css/vars.css";
import { darkColors, lightColors } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: darkColors.backgroundAlt,
  text: darkColors.text,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: lightColors.backgroundAlt,
  text: lightColors.text,
  boxShadow: vars.shadows.tooltip,
};
