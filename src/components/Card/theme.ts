import { darkColors, lightColors } from "../../theme/colors";
import { shadows } from "../../theme/base";

export type CardTheme = {
  background: string;
  boxShadow: string;
  boxShadowActive: string;
  boxShadowSuccess: string;
  boxShadowWarning: string;
};

export const light: CardTheme = {
  background: lightColors.card,
  boxShadow: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
};

export const dark: CardTheme = {
  background: darkColors.card,
  boxShadow: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  boxShadowActive: shadows.active,
  boxShadowSuccess: shadows.success,
  boxShadowWarning: shadows.warning,
};
