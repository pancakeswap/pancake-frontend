import { Balance, BalanceProps } from "@pancakeswap/uikit";
import { useMemo } from "react";

function getMinNumberToDisplay(decimals = 2) {
  return 1 / 10 ** decimals;
}

export function BalanceDisplay({ value, decimals = 2, prefix, ...props }: BalanceProps) {
  const minNumberToDisplay = useMemo(() => getMinNumberToDisplay(decimals), [decimals]);
  const isBalanceTooSmall = useMemo(() => value < minNumberToDisplay && value !== 0, [minNumberToDisplay, value]);
  const valueDisplay = useMemo(
    () => (isBalanceTooSmall ? minNumberToDisplay : value),
    [isBalanceTooSmall, value, minNumberToDisplay]
  );
  const prefixDisplay = useMemo(() => (isBalanceTooSmall ? "<" : prefix), [isBalanceTooSmall, prefix]);

  return <Balance value={valueDisplay} decimals={decimals} prefix={prefixDisplay} {...props} />;
}
