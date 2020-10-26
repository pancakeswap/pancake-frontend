import { Colors } from "../styled.d";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#1FC7D4",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
};

export const lightColors: Colors = {
  ...baseColors,
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  contrast: "#191326",
  input: "#F4F2F7",
  tertiary: "#EFF4F5",
  text: "#452A7A",
  textDisabled: "#BDC2C4",
  textSubtle: "#AEA0D6",
};

export const darkColors: Colors = {
  ...baseColors,
  background: "#191326",
  backgroundDisabled: "#524B63",
  contrast: "#FFFFFF",
  input: "#524B63",
  primaryDark: "#0098A1",
  tertiary: "#293450",
  text: "#ED4B9E",
  textDisabled: "#302B38",
  textSubtle: "#A28BD4",
};
