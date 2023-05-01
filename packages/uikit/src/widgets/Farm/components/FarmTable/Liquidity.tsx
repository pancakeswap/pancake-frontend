import { useTranslation } from "@pancakeswap/localization";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styled from "styled-components";
import { Skeleton } from "../../../../components/Skeleton";
import { HelpIcon } from "../../../../components/Svg";
import { Text } from "../../../../components/Text";
import { TooltipRefs, useTooltip } from "../../../../hooks/useTooltip";
import { FarmTableLiquidityProps } from "../../types";

const distanceToNow = (timeInMilliSeconds: number) => {
  const time = new Date(timeInMilliSeconds);
  return time > new Date() || !Number.isFinite(timeInMilliSeconds)
    ? `now`
    : formatDistanceToNow(time, { addSuffix: true });
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
      {updatedAt && <Text>Updated {distanceToNow(updatedAt)}</Text>}
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
