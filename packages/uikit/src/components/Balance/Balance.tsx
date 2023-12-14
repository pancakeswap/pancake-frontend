import { useMemo } from "react";
import CountUp from "react-countup";
import { Text, TextProps } from "../Text";

export interface BalanceProps extends TextProps {
  value: number;
  decimals?: number;
  unit?: string;
  isDisabled?: boolean;
  prefix?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  strikeThrough?: boolean;
  startFromValue?: boolean;
}

const Balance: React.FC<React.PropsWithChildren<BalanceProps>> = ({
  value,
  color = "text",
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  onClick,
  strikeThrough,
  startFromValue = false,
  ...props
}) => {
  const prefixProp = useMemo(() => (prefix ? { prefix } : {}), [prefix]);
  const suffixProp = useMemo(() => (unit ? { suffix: unit } : {}), [unit]);
  const showDecimals = useMemo(() => value % 1 !== 0, [value]);

  return (
    <CountUp
      start={startFromValue ? value : 0}
      preserveValue
      delay={0}
      end={value}
      {...prefixProp}
      {...suffixProp}
      decimals={showDecimals ? decimals : 0}
      duration={1}
      separator=","
    >
      {({ countUpRef }) => (
        <Text
          color={isDisabled ? "textDisabled" : color}
          style={strikeThrough ? { textDecoration: "line-through" } : undefined}
          onClick={onClick}
          {...props}
        >
          <span ref={countUpRef} />
        </Text>
      )}
    </CountUp>
  );
};

export default Balance;
