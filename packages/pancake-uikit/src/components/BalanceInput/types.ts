import { InputHTMLAttributes, ReactNode, ReactText } from "react";
import { BoxProps } from "../Box";

export interface BalanceInputProps extends BoxProps {
  value: ReactText;
  onUserInput: (input: string) => void;
  innerRef?: React.RefObject<HTMLInputElement>;
  currencyValue?: ReactNode;
  placeholder?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "placeholder" | "onChange">;
  isWarning?: boolean;
  decimals?: number;
  unit?: string;
  switchEditingUnits?: () => void;
}

export interface TextfieldProps {
  label: ReactNode;
  value: ReactText;
  placeholder?: string;
  onUserInput: (input: string) => void;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "placeholder" | "onChange">;
  isWarning?: boolean;
}
