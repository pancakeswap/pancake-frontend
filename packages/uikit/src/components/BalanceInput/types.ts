import { InputHTMLAttributes, ReactNode } from "react";
import { BoxProps } from "../Box";
import { InputProps } from "../Input";

export interface BalanceInputProps extends BoxProps {
  value: string | number;
  onUserInput: (input: string) => void;
  inputAlign?: "left" | "right";
  innerRef?: React.RefObject<HTMLInputElement>;
  currencyValue?: ReactNode;
  placeholder?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "placeholder" | "onChange"> & InputProps;
  isWarning?: boolean;
  decimals?: number;
  unit?: ReactNode;
  appendComponent?: ReactNode;
  switchEditingUnits?: () => void;
}

export interface TextfieldProps {
  label: ReactNode;
  value: string | number;
  placeholder?: string;
  onUserInput: (input: string) => void;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "placeholder" | "onChange">;
  isWarning?: boolean;
}
