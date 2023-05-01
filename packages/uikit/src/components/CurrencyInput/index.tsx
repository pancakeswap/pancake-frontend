import { useMemo, useCallback, ReactNode, MouseEvent } from "react";
import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import { CurrencyLogo } from "../CurrencyLogo";
import { BalanceInput } from "../BalanceInput";
import { Flex } from "../Box";
import { Text } from "../Text";
import { Button } from "../Button";

interface Props {
  value: string | number;
  onChange: (val: string) => void;
  currency?: Currency;
  balance?: CurrencyAmount<Currency>;
  balanceText?: ReactNode;
  maxText?: ReactNode;
}

export function CurrencyInput({ currency, balance, value, onChange, balanceText, maxText = "Max" }: Props) {
  const isMax = useMemo(() => balance && value && balance.toExact() === value, [balance, value]);
  const onMaxClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange?.(balance?.toExact() || "");
    },
    [onChange, balance]
  );

  const currencyDisplay = currency ? (
    <Flex justifyContent="flex-end">
      <CurrencyLogo currency={currency} />
      <Text bold ml="4px">
        {currency.symbol}
      </Text>
    </Flex>
  ) : null;

  const balanceDisplay = balance ? (
    <Flex justifyContent="flex-end" alignItems="center">
      <Text color="textSubtle" fontSize={1}>
        {balanceText}
      </Text>
      <Button
        onClick={onMaxClick}
        scale="xs"
        ml="4px"
        variant={isMax ? "primary" : "secondary"}
        style={{ textTransform: "uppercase" }}
      >
        {maxText}
      </Button>
    </Flex>
  ) : null;

  return (
    <BalanceInput
      inputProps={{ style: { textAlign: "left" } }}
      value={value}
      onUserInput={onChange}
      unit={currencyDisplay}
      currencyValue={balanceDisplay}
    />
  );
}
