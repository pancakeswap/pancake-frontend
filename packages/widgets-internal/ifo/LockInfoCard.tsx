import { useTranslation } from "@pancakeswap/localization";
import { RowBetween, AutoColumn, Text, Card, CardBody } from "@pancakeswap/uikit";
import { formatUnixTimestamp } from "@pancakeswap/utils/formatTimestamp";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useMemo } from "react";
import styled from "styled-components";
import { SpaceProps } from "styled-system";

import relativeTime from "dayjs/plugin/relativeTime";
import { BalanceDisplay } from "./BalanceDisplay";

dayjs.extend(relativeTime);

type Props = {
  amount?: BigNumber | number | string;
  usdPrice?: number | BigNumber | string;

  // Unix timestamp
  unlockAt?: number;
} & SpaceProps;

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.tertiary};
`;

const StyledCardBody = styled(CardBody)`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

export function LockInfoCard({ amount = 0, usdPrice = 0, unlockAt = 0, ...props }: Props) {
  const { t } = useTranslation();
  const amountNum = useMemo(() => new BigNumber(amount).toNumber(), [amount]);
  const usdAmount = useMemo(() => {
    return new BigNumber(usdPrice).times(new BigNumber(amount)).toNumber();
  }, [usdPrice, amount]);
  const unlockIn = useMemo(() => dayjs().from(dayjs.unix(unlockAt), true), [unlockAt]);
  const unlockDisplay = useMemo(() => formatUnixTimestamp(unlockAt), [unlockAt]);

  return (
    <StyledCard {...props}>
      <StyledCardBody>
        <RowBetween>
          <AutoColumn>
            <Text fontSize="0.75rem" color="textSubtle" textTransform="uppercase" bold>
              {t("CAKE locked")}
            </Text>
            <BalanceDisplay bold value={amountNum} decimals={2} fontSize="1.25rem" />
            <BalanceDisplay prefix="~" value={usdAmount} decimals={2} unit=" USD" fontSize="0.75rem" />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize="0.75rem" color="textSubtle" textTransform="uppercase" bold>
              {t("Unlocks in")}
            </Text>
            <Text bold fontSize="1.25rem">
              {unlockIn}
            </Text>
            <Text fontSize="0.75rem">
              {t("On %time%", {
                time: unlockDisplay,
              })}
            </Text>
          </AutoColumn>
        </RowBetween>
      </StyledCardBody>
    </StyledCard>
  );
}
