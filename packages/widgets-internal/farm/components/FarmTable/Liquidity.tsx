import { TranslateFunction, useTranslation } from "@pancakeswap/localization";
import { HelpIcon, Skeleton, Text, TooltipRefs, useTooltip } from "@pancakeswap/uikit";
import getTimePeriods from "@pancakeswap/utils/getTimePeriods";
import dayjs from "dayjs";
import { styled } from "styled-components";
import { FarmTableLiquidityProps } from "../../types";

const distanceToNow = (t: TranslateFunction, timeInMilliSeconds: number) => {
  if (!Number.isFinite(timeInMilliSeconds)) return t("Now");

  const time = dayjs(timeInMilliSeconds);
  const now = dayjs();

  if (time.isAfter(now)) return t("Now");

  const secondsRemaining = time.diff(now, "seconds");
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining);

  let toNowString = "";
  if (days !== 0) toNowString += `${days}${t("d")} `;
  if (hours !== 0) toNowString += `${hours}${t("h")} `;
  if (minutes !== 0) toNowString += `${minutes}${t("m")} `;
  if (seconds !== 0) toNowString += `${seconds}${t("s")} `;

  return toNowString.trim();
};

const ReferenceElement = styled.div`
  display: inline-block;
`;

const LiquidityWrapper = styled.div`
  min-width: 110px;
  font-weight: 600;
  text-align: right;
  margin-right: 4px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;
export const StakedLiquidity: React.FunctionComponent<React.PropsWithChildren<FarmTableLiquidityProps>> = ({
  liquidity,
  updatedAt,
  inactive,
}) => {
  const { t } = useTranslation();

  const tooltip = useTooltip(
    <>
      <Text>{t("Total active (in-range) liquidity staked in the farm.")}</Text>
      {updatedAt && <Text>{t("Updated %dateUpdated% ago", { dateUpdated: distanceToNow(t, updatedAt) })}</Text>}
    </>,
    {
      placement: "top-end",
      tooltipOffset: [20, 10],
    }
  );

  if (inactive) {
    return <Text>-</Text>;
  }

  return <LiquidityComp liquidity={liquidity} {...tooltip} />;
};

const LiquidityComp = ({
  liquidity,
  targetRef,
  tooltip,
  tooltipVisible,
}: {
  liquidity: FarmTableLiquidityProps["liquidity"];
} & TooltipRefs) => {
  const displayLiquidity =
    liquidity && liquidity.gt(0) ? (
      `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    ) : (
      <Skeleton width={60} />
    );
  return (
    <Container>
      <LiquidityWrapper>
        <Text>{displayLiquidity}</Text>
      </LiquidityWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="textSubtle" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  );
};

const Liquidity: React.FunctionComponent<React.PropsWithChildren<FarmTableLiquidityProps>> = ({ liquidity }) => {
  const { t } = useTranslation();
  const tooltip = useTooltip(t("Total value of the funds in this farm’s liquidity pair"), {
    placement: "top-end",
    tooltipOffset: [20, 10],
  });

  return <LiquidityComp liquidity={liquidity} {...tooltip} />;
};

export default Liquidity;
