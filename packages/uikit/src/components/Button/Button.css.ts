import { atoms } from "@pancakeswap/ui/css/atoms";
import { vars } from "@pancakeswap/ui/css/vars.css";
import { style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const scales = {
  xs: style([
    atoms({
      py: 0,
      px: "8px",
      fontSize: "12px",
    }),
    style({
      height: "20px",
    }),
  ]),
  sm: style([
    style({
      height: "32px",
    }),
    atoms({
      py: 0,
      fontSize: "16px",
      px: "16px",
    }),
  ]),

  md: style([
    style({
      height: "48px",
    }),
    atoms({
      fontSize: "16px",
      px: "24px",
      py: 0,
    }),
  ]),
};

const boxShadow = "0px -1px 0px 0px rgba(14, 14, 44, 0.4) inset";

export type Scale = keyof typeof scales;

const variant = {
  primary: style([
    atoms({
      backgroundColor: "primary",
      color: "white",
    }),
    style({
      boxShadow,
    }),
  ]),
  secondary: style([
    atoms({
      backgroundColor: "transparent",
      borderColor: "primary",
      color: "primary",
    }),
    style({
      border: "2px solid",
      boxShadow: "none",
      selectors: {
        "&:disabled": {
          backgroundColor: "transparent",
        },
      },
    }),
  ]),
  tertiary: style([
    atoms({
      backgroundColor: "tertiary",
      color: "$primary",
    }),
    style({
      boxShadow: "none",
    }),
  ]),
  subtle: atoms({
    backgroundColor: "$textSubtle",
    color: "$backgroundAlt",
  }),
  danger: style([
    atoms({
      backgroundColor: "$failure",
      color: "white",
    }),
    style({
      boxShadow,
    }),
  ]),
  text: style([
    atoms({
      backgroundColor: "transparent",
      color: "$primary",
    }),
    style({
      boxShadow: "none",
    }),
  ]),
  success: style([
    style({
      boxShadow,
    }),
    atoms({
      backgroundColor: "$success",
      color: "white",
    }),
  ]),
  light: style([
    atoms({
      backgroundColor: "$input",
      color: "$textSubtle",
    }),
    style({
      boxShadow: "none",
    }),
  ]),
};

export type Variant = keyof typeof variant;

const loading = {
  true: style({
    opacity: 0.5,
    cursor: "not-allowed",
  }),
  false: {},
};

export const variants = recipe({
  base: style([
    {
      position: "relative",
      alignItems: "center",
      borderWidth: 0,
      borderRadius: 16,
      cursor: "pointer",
      display: "inline-flex",
      fontFamily: "inherit",
      fontWeight: 600,
      justifyContent: "center",
      letterSpacing: "0.03em",
      lineHeight: 1,

      selectors: {
        "&:hover:not(:disabled):not(:active)": {
          opacity: 0.65,
        },
        "&:active:not(:disabled)": {
          opacity: 0.85,
          transform: "translateY(1px)",
          boxShadow: "none",
        },
        "&:disabled": {
          backgroundColor: vars.colors.backgroundDisabled,
          borderColor: vars.colors.backgroundDisabled,
          boxShadow: "none",
          color: vars.colors.textDisabled,
          cursor: "not-allowed",
        },
      },
    },
  ]),
  variants: {
    loading,
    variant,
    scale: scales,
  },
  defaultVariants: {
    scale: "md",
    variant: "primary",
  },
});

export type Variants = RecipeVariants<typeof variants>;
