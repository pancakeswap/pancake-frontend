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

const greenTheme = {
  background: lightColors.success,
  color: "#FFFFFF",
  colorOutline: lightColors.success,
  borderColorOutline: lightColors.success,
};

const grayTheme = {
  background: lightColors.textDisabled,
  color: "#FFFFFF",
  colorOutline: lightColors.textDisabled,
  borderColorOutline: lightColors.textDisabled,
};

export const light: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
  green: greenTheme,
  gray: grayTheme,
};

export const dark: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
  green: greenTheme,
  gray: grayTheme,
};
