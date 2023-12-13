import { useTranslation } from "@pancakeswap/localization";
import { Balance, Skeleton, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { getBalanceNumber } from "@pancakeswap/utils/formatBalance";
import BigNumber from "bignumber.js";
import { StatWrapper } from "./StatWrapper";

export const TotalToken = ({
  total,
  tokenDecimals,
  decimalsToShow,
  symbol,
}: {
  total?: BigNumber;
  tokenDecimals: number;
  decimalsToShow: number;
  symbol: string;
}) => {
  if (total && total.gte(0)) {
    return (
      <Balance small value={getBalanceNumber(total, tokenDecimals)} decimals={decimalsToShow} unit={` ${symbol}`} />
    );
  }
  return <Skeleton width="90px" height="21px" />;
};

export const TotalStaked: React.FC<
  React.PropsWithChildren<{ totalStaked?: BigNumber; tokenDecimals: number; decimalsToShow: number; symbol: string }>
> = ({ totalStaked, tokenDecimals, decimalsToShow, symbol }) => {
  const { t } = useTranslation();

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Total amount of %symbol% staked in this pool", { symbol }),
    {
      placement: "bottom",
    }
  );

  return (
    <StatWrapper
      label={
        <TooltipText ref={targetRef} small>
          {t("Total staked")}:
        </TooltipText>
      }
    >
      {tooltipVisible && tooltip}
      <TotalToken total={totalStaked} tokenDecimals={tokenDecimals} decimalsToShow={decimalsToShow} symbol={symbol} />
    </StatWrapper>
  );
};
