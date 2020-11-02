import { TagTheme } from "./types";
import { lightColors } from "../../theme/colors";

const pinkTheme = {
  background: lightColors.failure,
  color: "#FFFFFF",
  colorOutline: lightColors.failure,
  borderColorOutline: lightColors.failure,
};

const purpleTheme = {
  background: lightColors.secondary,
  color: "#FFFFFF",
  colorOutline: lightColors.secondary,
  borderColorOutline: lightColors.secondary,
};

export const light: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
};

export const dark: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
};
