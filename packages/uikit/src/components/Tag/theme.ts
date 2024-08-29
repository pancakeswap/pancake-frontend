import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "28px",
    padding: "0 8px",
    fontSize: "14px",
  },
  [scales.SM]: {
    height: "24px",
    padding: "0 4px",
    fontSize: "12px",
  },
};

interface IStyleVariantsProps {
  backgroundColor?: string;
  bg?: string;
  color?: string;
  border?: string;
  borderColor?: string;
}
export const styleVariants: { [key: string]: IStyleVariantsProps } = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
  },
  [variants.SECONDARY]: {
    backgroundColor: "secondary",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
  },
  [variants.TEXTDISABLED]: {
    backgroundColor: "textDisabled",
  },
  [variants.TEXTSUBTLE]: {
    backgroundColor: "textSubtle",
  },
  [variants.BINANCE]: {
    backgroundColor: "binance",
  },
  [variants.FAILURE]: {
    backgroundColor: "failure",
  },
  [variants.WARNING]: {
    backgroundColor: "warning",
  },
  [variants.GRADIENTBOLD]: {
    bg: "gradientBold",
  },
  [variants.FAILURE_LOW_CONTRAST]: {
    backgroundColor: "destructive10",
    color: "destructive",
    border: "2px solid",
    borderColor: "destructive20",
  },
  [variants.SUCCESS_LOW_CONTRAST]: {
    backgroundColor: "positive10",
    color: "positive60",
    border: "2px solid",
    borderColor: "positive20",
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    color: "textSubtle",
    border: "2px solid",
    borderColor: "tertiary20",
  },
  [variants.PRIMARY60]: {
    backgroundColor: "primary10",
    color: "primary60",
    border: "2px solid",
    borderColor: "primary20",
  },
};
