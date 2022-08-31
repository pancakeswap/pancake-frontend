import { darkColors, lightColors } from "../../theme/colors";
import { shadows } from "../../theme/base";
import { CardTheme } from "./types";

export const light: CardTheme = {
  background: lightColors.backgroundAlt,
  boxShadow: shadows.level1,
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: {
    default: lightColors.gradientCardHeader,
    blue: lightColors.gradientBlue,
    bubblegum: lightColors.gradientBubblegum,
    violet: lightColors.gradientViolet,
  },
  dropShadow: "drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))",
};

export const dark: CardTheme = {
  background: darkColors.backgroundAlt,
  boxShadow: shadows.level1,
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
  cardHeaderBackground: {
    default: darkColors.gradientCardHeader,
    blue: darkColors.gradientBlue,
    bubblegum: lightColors.gradientBubblegum,
    violet: darkColors.gradientViolet,
  },
  dropShadow: "drop-shadow(0px 1px 4px rgba(25, 19, 38, 0.15))",
};
