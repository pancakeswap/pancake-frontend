import { Text, TextProps } from "@pancakeswap/uikit";
import { useCallback, useMemo } from "react";
import CountUp from "react-countup";
import _toNumber from "lodash/toNumber";
import _isNaN from "lodash/isNaN";
import _replace from "lodash/replace";
import _toString from "lodash/toString";

interface BalanceProps extends TextProps {
  value: number;
  decimals?: number;
  unit?: string;
  isDisabled?: boolean;
  prefix?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const formatNumber = new Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 1 }).format;

const formatStringNumber = (value: string | number) => {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return String(value);
  }
  return String(formatNumber(number));
};
const Balance: React.FC<React.PropsWithChildren<BalanceProps>> = ({
  value,
  color = "text",
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  ...props
}) => {
  const prefixProp = useMemo(() => (prefix ? { prefix } : {}), [prefix]);
  const suffixProp = useMemo(() => (unit ? { suffix: unit } : {}), [unit]);
  const formattingFn = useCallback(
    (val: number) => (prefixProp.prefix ?? "") + formatStringNumber(val) + (suffixProp.suffix ?? ""),
    [prefixProp.prefix, suffixProp.suffix]
  );

  return (
    <CountUp
      start={0}
      preserveValue
      delay={0}
      end={value}
      decimals={decimals}
      duration={1}
      separator=","
      formattingFn={formattingFn}
    >
      {({ countUpRef }) => (
        <Text color={isDisabled ? "textDisabled" : color} onClick={onClick} {...props}>
          <span ref={countUpRef} />
        </Text>
      )}
    </CountUp>
  );
};

export default Balance;
