import { Colors } from "./types";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#1FC7D4",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
};

export const brandColors = {
  binance: "#F0B90B",
};

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  contrast: "#191326",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  tertiary: "#EFF4F5",
  text: "#452A7A",
  textDisabled: "#BDC2C4",
  textSubtle: "#AEA0D6",
  borderColor: "#E9EAEB",
};

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  background: "#191326",
  backgroundDisabled: "#524B63",
  contrast: "#FFFFFF",
  invertedContrast: "#191326",
  input: "#473d5d",
  primaryDark: "#0098A1",
  tertiary: "#293450",
  text: "#DBCDF9",
  textDisabled: "#302B38",
  textSubtle: "#A28BD4",
  borderColor: "#524B63",
};
