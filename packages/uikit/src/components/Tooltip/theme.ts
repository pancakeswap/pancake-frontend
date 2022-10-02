import { vars } from "@pancakeswap/ui/css/vars.css";
import { darkColors, lightColors } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: lightColors.tooltipBackground,
  text: lightColors.tooltipText,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: darkColors.tooltipBackground,
  text: darkColors.tooltipText,
  boxShadow: vars.shadows.tooltip,
};
