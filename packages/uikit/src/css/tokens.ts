import base, { shadows } from "../theme/base";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#1FC7D4",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#7645D9",
  success: "#31D0AA",
  warning: "#FFB237",
};

export const additionalColors = {
  binance: "#F0B90B",
  overlay: "#452a7a",
  gold: "#FFC700",
  silver: "#B2B2B2",
  bronze: "#E7974D",
};

export const lightColors = {
  ...baseColors,
  ...additionalColors,
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  backgroundAlt2: "rgba(255, 255, 255, 0.7)",
  cardBorder: "#E7E3EB",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  dropdownDeep: "#EEEEEE",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  text: "#280D5F",
  textDisabled: "#BDC2C4",
  textSubtle: "#7A6EAA",
  disabled: "#E9EAEB",
  gradientBubblegum: "linear-gradient(139.73deg, #E5FDFF 0%, #F3EFFF 100%)",
  gradientInverseBubblegum: "linear-gradient(139.73deg, #F3EFFF 0%, #E5FDFF 100%)",
  gradientCardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
  gradientBlue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
  gradientViolet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
};

export const darkColors = {
  ...baseColors,
  ...additionalColors,
  secondary: "#9A6AFF",
  background: "#08060B",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "#27262c",
  backgroundAlt2: "rgba(39, 38, 44, 0.7)",
  cardBorder: "#383241",
  contrast: "#FFFFFF",
  dropdown: "#1E1D20",
  dropdownDeep: "#100C18",
  invertedContrast: "#191326",
  input: "#372F47",
  inputSecondary: "#262130",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#F4EEFF",
  textDisabled: "#666171",
  textSubtle: "#B8ADD2",
  disabled: "#524B63",
  gradientBubblegum: "linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)",
  gradientInverseBubblegum: "linear-gradient(139.73deg, #3D2A54 0%, #313D5C 100%)",
  gradientCardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
  gradientBlue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
  gradientViolet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
  gradientVioletAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
  gradientGold: "linear-gradient(180deg, #FFD800 0%, #FDAB32 100%)",
};

export const tokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  fonts: {
    normal: "'Kanit', sans-serif",
    mono: "SFMono, ui-monospace, monospace",
  },
  space: {
    "0": "0px",
    px: "1px",
    "1": "4px",
    "2": "8px",
    "3": "16px",
    "4": "24px",
    "5": "32px",
    "6": "48px",
    "7": "64px",
    "4px": "4px",
    "8px": "8px",
    "12px": "12px",
    "16px": "16px",
    "24px": "24px",
    "32px": "32px",
    "48px": "48px",
    "64px": "64px",
  },
  borderWidths: {
    "0": "0px",
    "1": "1px",
    "2": "2px",
  },
  radii: {
    "0": "0px",
    ...base.radii,
  },
  fontSizes: {
    "10px": "10px",
    "12px": "12px",
    "16px": "16px",
    "14px": "14px",
    "20px": "20px",
    "40px": "40px",
  },
  shadows,
};

export type Mode = "light" | "dark";
export type Tokens = typeof tokens;
