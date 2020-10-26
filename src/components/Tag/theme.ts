import { TagTheme } from "./types";
import { lightColors } from "../../theme/colors";

const pinkTheme = {
  background: lightColors.failure,
  color: "#FFFFFF",
};

const purpleTheme = {
  background: lightColors.secondary,
  color: "#FFFFFF",
};

export const light: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
};

export const dark: TagTheme = {
  pink: pinkTheme,
  purple: purpleTheme,
};
