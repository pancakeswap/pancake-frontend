import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import { darken, lighten, alpha } from "@material-ui/core/styles/colorManipulator";
import createTypography from "@material-ui/core/styles/createTypography";
import createPalette from "@material-ui/core/styles/createPalette";
import type { Theme } from "@material-ui/core/styles";
import { darkColors } from "@pancakeswap/uikit";

// utils
const fontSize = 14;
const htmlFontSize = 16;
const coef = fontSize / 14;

function pxToRem(size: number) {
  return `${(size / htmlFontSize) * coef}rem`;
}

function pointsToRem(size: number) {
  return `${size / 1000}rem`;
}

function adaptColor(type: string, color: string, coefficient: number) {
  return (typeof type === "string" && type === "light") || (typeof type === "boolean" && type)
    ? darken(color, coefficient)
    : lighten(color, coefficient);
}

// theme definition

const FontFamily = {
  KANIT: "'Kanit', sans-serif",
};

const FontWeight = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
};

const palette = createPalette({
  type: "dark",
  primary: {
    light: "#BFBFBF",
    main: "#EFEFEF",
    dark: "#EFEFEF",
    contrastText: "#000000",
  },
  info: {
    main: "#50A0BE",
    light: "#323232",
  },
  success: {
    main: "#50BEAF",
  },
  error: {
    main: "#F3566B",
  },
  warning: {
    main: "#BEA850",
  },
  // @ts-ignore
  borders: {
    disabled: "#494747",
    default: "#9A9A9A",
  },
  text: {
    primary: "#ffffff",
    secondary: "#999999",
    disabled: "#9A9A9A",
  },
  divider: "#323232",
  background: {
    // backgorund change
    paper: darkColors.backgroundAlt,
    default: "#000000",
  },
  action: {
    disabled: "#666666",
    disabledBackground: "#1A1A1A",
  },
});

const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
});

const typography = createTypography(palette, {
  fontFamily: FontFamily.KANIT,
  h1: {
    lineHeight: pxToRem(46),
    letterSpacing: "-3%",
    fontSize: pxToRem(46),
    fontWeight: FontWeight.MEDIUM,
  },
  h2: {
    lineHeight: pxToRem(36),
    fontSize: pxToRem(36),
    letterSpacing: "-2%",
    fontWeight: FontWeight.MEDIUM,
  },
  h3: {
    lineHeight: pxToRem(25),
    fontSize: pxToRem(24),
    letterSpacing: "-2%",
    fontWeight: FontWeight.MEDIUM,
  },
  h4: {
    lineHeight: pxToRem(24),
    fontSize: pxToRem(20),
    letterSpacing: "0%",
    fontWeight: FontWeight.MEDIUM,
  },
  h5: {
    lineHeight: pxToRem(24),
    letterSpacing: pxToRem(0.18),
  },
  h6: {
    lineHeight: pxToRem(24),
    letterSpacing: pxToRem(0.15),
  },
  subtitle1: {
    lineHeight: pxToRem(24),
    letterSpacing: pxToRem(0.14),
  },
  subtitle2: {
    lineHeight: pxToRem(24),
    letterSpacing: pxToRem(0.1),
  },
  body1: {
    lineHeight: pxToRem(24),
    letterSpacing: pxToRem(0.5),
  },
  body2: {
    lineHeight: pxToRem(20),
    letterSpacing: pxToRem(0.25),
  },
  button: {
    lineHeight: pxToRem(16),
    letterSpacing: pxToRem(1.25),
  },
  caption: {
    lineHeight: pxToRem(16),
    letterSpacing: pxToRem(0.24),
  },
  overline: {
    fontSize: pxToRem(10),
    lineHeight: pxToRem(16),
    letterSpacing: pxToRem(1.5),
  },
});

export const darkTheme: Theme = {
  palette,
  typography,
  breakpoints,
  props: {
    MuiTextField: {
      InputLabelProps: {
        shrink: true,
      },
    },
    // @ts-ignore
    MuiAlert: {
      icon: false,
    },
  },
  shape: {
    borderRadius: 18,
  },
  overrides: {
    MuiPaper: {
      root: {
        borderRadius: 32,
      },
    },
    MuiSlider: {
      root: {
        color: "#50BEAF",
      },
      rail: {
        color: "#D9D9D9",
      },
      mark: {
        color: "#D9D9D9",
      },
    },
    MuiTypography: {
      button: {
        textTransform: "none",
      },
    },
    MuiTable: {
      root: {
        backgroundColor: palette.background.paper,
      },
    },
    MuiSwitch: {
      root: {
        "&.MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track": {
          backgroundColor: "#323232",
        },
      },
      switchBase: {
        background: "none",
        "&:hover, .checked:hover": {
          background: "none",
        },
      },
      colorSecondary: {
        "&.Mui-checked + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#FFFFFF",
        },
        "&.MuiSwitch-colorSecondary.Mui-checked": {
          "&:hover": {
            background: "none",
          },
        },
      },
      thumb: {
        backgroundColor: "#999999",
      },
    },
    MuiTableCell: {
      root: {
        height: pxToRem(76),
        padding: `${pxToRem(16)} ${pxToRem(32)}`,
        fontWeight: 400,
        fontSize: pxToRem(16),
        lineHeight: pxToRem(18.75),
        "&.MuiTableCell-head": {
          color: `${palette.text.secondary} !important`,
          fontSize: pxToRem(16),
          fontWeight: 400,
          lineHeight: pxToRem(18.75),
          height: pxToRem(69),
        },
      },
    },
    MuiTableRow: {
      root: {
        borderBottom: `${pxToRem(1.016)} solid ${palette.divider}`,
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: palette.divider,
        },
      },
      head: {
        "&:hover": {
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiIconButton: {
      root: {
        "&:hover": {
          backgroundColor: "transparent !important",
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 12,
        fontFamily: FontFamily.KANIT,
        fontWeight: FontWeight.MEDIUM,
        letterSpacing: "0.04em",
        textTransform: "none",
      },
      sizeSmall: {
        borderRadius: 8,
        fontSize: pxToRem(14),
        letterSpacing: 0,
      },
      sizeLarge: {
        borderRadius: 12,
        fontSize: pxToRem(16),
        letterSpacing: 0,
        fontWeight: 500,
      },
      contained: {
        padding: `13px 16px 11px 16px`,
        fontSize: pxToRem(14),
        boxShadow: "none",
        "&$disabled, &$disabled:hover": {
          color: "#323232",
          backgroundColor: "#999999 !important",
        },
        "&:hover": {
          boxShadow: "none",
        },
      },
      containedPrimary: {
        "& [class^=MuiButton-label]": {
          position: "relative",
          width: "initial",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            width: "100%",
            backgroundColor: palette.background.default,
            transform: "scaleX(0)",
            transition: "transform 150ms ease-out",
            transformOrigin: "left",
          },
        },
        "&:hover": {
          backgroundColor: palette.primary.light,
          boxShadow: "none",
          "& [class^=MuiButton-label]::after": {
            transform: "scaleX(1)",
          },
        },
      },
      containedSizeSmall: {
        padding: `6px 12px 4px 12px`,
      },
      containedSizeLarge: {
        padding: `20px 24px`,
      },
      outlined: {
        backgroundColor: palette.background.default,
        color: palette.primary.main,
        padding: `11px 15px 9px 15px`,
        fontSize: pxToRem(14),
        letterSpacing: pointsToRem(89),
        boxShadow: "none",
        "&$disabled, &$disabled:hover": {
          color: "#666666",
          borderColor: "#404040!important",
        },
        "&:hover": {
          boxShadow: "none",
          backgroundColor: "#1A1A1A!important",
        },
      },
      outlinedPrimary: {
        border: `1px solid ${palette.primary.main}`,
        "&:hover": {
          border: `1px solid ${palette.primary.main}`,
          "& [class^=MuiButton-label]::after": {
            transform: "scaleX(1)",
          },
        },
        "&$disabled": {
          border: `1px solid ${palette.action.disabled}`,
        },
        "&$outlinedSizeSmall": {
          border: `1px solid ${palette.primary.main}`,
        },
        "& [class^=MuiButton-label]": {
          position: "relative",
          width: "initial",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1.5px",
            width: "100%",
            backgroundColor: palette.text.primary,
            transform: "scaleX(0)",
            transition: "transform 150ms ease-out",
            transformOrigin: "left",
          },
        },
      },
      outlinedSizeSmall: {
        padding: `5px 11px 3px 11px`,
      },
      outlinedSizeLarge: {
        padding: `18px 23px`,
      },
    },
    MuiInputBase: {
      formControl: {
        backgroundColor: darkColors.input,
        borderColor: palette.divider,
        "&:hover": {
          backgroundColor: darkColors.inputSecondary,
        },
        "label + &": {
          marginTop: 24,
        },
        "label.MuiFormLabel-filled + &:not($focused):not($error)": {
          backgroundColor: darkColors.input,
        },
      },
      root: {
        "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
          display: "none",
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 18,
        height: 56,
        backgroundColor: darkColors.input,
        color: darkColors.text,
        transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        borderColor: "none",
        "&$focused:not($error) $notchedOutline": {
          borderWidth: 1,
          borderColor: darkColors.input,
        },
        "&$notchedOutline": {
          borderColor: darkColors.input,
        },
        "&$error $notchedOutline": {
          borderWidth: 1,
          borderColor: palette.error.main,
        },
        "&$disabled": {
          backgroundColor: palette.action.disabledBackground,
          color: "#666666",
          "& $notchedOutline": {
            borderWidth: 0,
          },
        },
        "&$focused": {
          backgroundColor: darkColors.input,
          borderColor: darkColors.input,
        },
        "&:hover $notchedOutline": {
          borderColor: darkColors.input,
        },
        "label.MuiFormLabel-filled + &:not($focused):not($error) $notchedOutline": {
          borderColor: darkColors.input,
        },
      },
      focused: {},
      disabled: {},
      error: {},
      input: {
        fontSize: pxToRem(16),
        padding: `${(56 - 24) / 2}px 16px`,
      },
      notchedOutline: {
        transition: "border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
        borderColor: "#333333",
        borderTopColor: "#333333",
        borderBottomColor: "#333333",
        borderLeftColor: "#333333",
        borderRightColor: "#333333",
        top: 0,
        "& > legend": {
          display: "none",
        },
      },
    },
    MuiInputAdornment: {
      root: {
        color: "#757575",
      },
    },
    MuiInputLabel: {
      outlined: {
        "&$shrink": {
          transform: "translateY(3px) scale(0.9)",
          fontSize: pxToRem(14),
          lineHeight: pxToRem(20),
          letterSpacing: 0.25,
        },
        "&$disabled": {
          color: palette.action.disabled,
        },
      },
      shrink: {},
      disabled: {},
    },
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        marginRight: 0,
      },
    },
    MuiFormLabel: {
      root: {
        color: palette.text.secondary,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: palette.action.disabledBackground,
        color: palette.action.disabled,
        cursor: "pointer",
        width: 85,
        height: 28,
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
        color: palette.primary.contrastText,
        backgroundColor: palette.primary.light,
        maxWidth: 140,
      },
      arrow: {
        color: palette.primary.light,
      },
    },
    MuiAccordionSummary: {
      root: {
        margin: 0,
        [breakpoints.up("md")]: {
          padding: "0 24px",
        },
        "&$expanded": {
          minHeight: 56,
        },
      },
      content: {
        margin: "12px 0",

        "&$expanded": {
          margin: "12px 0",
        },
        [breakpoints.up("md")]: {
          margin: "16px 0",

          "&$expanded": {
            margin: "16px 0",
          },
        },
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: alpha("#000", 0.8),
      },
    },
    MuiDialog: {
      paper: {
        boxShadow: "none",
      },
      container: {
        paddingBottom: 16,
      },
    },
    MuiDialogContent: {
      root: {
        paddingBottom: 16,
      },
    },
    MuiBottomNavigationAction: {
      root: {
        color: "#757575",
        "&$selected": {
          color: palette.text.primary,
        },
      },
      label: {
        "& > span": {
          textTransform: "none",
        },
      },
    },
    MuiSelect: {
      root: {
        "&$disabled + input + $icon": {
          opacity: 0.5,
        },
      },
      icon: {
        color: palette.action.disabled,
        right: 16,
      },
      iconOutlined: {
        right: 16,
      },
    },
    MuiLinearProgress: {
      root: {
        height: 2,
        width: "100%",
      },
      barColorPrimary: {
        backgroundColor: palette.success.main,
      },
    },
    // @ts-ignore
    MuiAlert: {
      root: {
        borderRadius: 8,
        padding: "8px 16px",
      },
      message: {
        color: palette.text.primary,
        ...typography.caption,
      },
      standardInfo: {
        backgroundColor: alpha(palette.info.main, 0.6),
      },
      standardSuccess: {
        backgroundColor: alpha(palette.success.main, 0.6),
      },
      standardWarning: {
        backgroundColor: alpha(palette.warning.main, 0.6),
      },
      standardError: {
        backgroundColor: alpha(palette.error.main, 0.6),
      },
    },
    MuiAvatar: {
      root: {
        height: pxToRem(24),
        width: pxToRem(24),
      },
    },
  },
};
