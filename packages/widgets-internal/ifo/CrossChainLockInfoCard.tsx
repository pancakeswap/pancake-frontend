import { ChainId } from "@pancakeswap/chains";
import { useTranslation } from "@pancakeswap/localization";
import { Box, BoxProps, Flex, FlexGap, Text } from "@pancakeswap/uikit";
import { formatUnixTimestamp } from "@pancakeswap/utils/formatTimestamp";
import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import { BalanceDisplay } from "./BalanceDisplay";
import { ChainLogo } from "./ChainLogo";
import { ChainNameMap, IfoChainId } from "./constants";
import { Divider, GradientCard, TwoColumns } from "./styles";

dayjs.extend(relativeTime);

interface CrossChainLockInfoCardProps extends BoxProps {
  veCakeAmount: string | number | BigNumber;

  cakeLocked: string | number | BigNumber;
  usdPrice: string | number | BigNumber;

  unlockAt: number;

  targetChainId?: IfoChainId;
}

export const CrossChainLockInfoCard = ({
  veCakeAmount,

  cakeLocked,
  usdPrice,

  unlockAt,

  targetChainId = ChainId.BSC,

  ...props
}: CrossChainLockInfoCardProps) => {
  const { t } = useTranslation();

  const veCakeAmountNum = useMemo(() => new BigNumber(veCakeAmount).toNumber(), [veCakeAmount]);

  const cakeLockedNum = useMemo(() => new BigNumber(cakeLocked).toNumber(), [cakeLocked]);
  const cakeLockedUsdAmount = useMemo(() => {
    return new BigNumber(usdPrice).times(new BigNumber(cakeLocked)).toNumber();
  }, [usdPrice, cakeLocked]);

  const unlockIn = useMemo(() => dayjs().from(dayjs.unix(unlockAt), true), [unlockAt]);
  const unlockDisplay = useMemo(() => formatUnixTimestamp(unlockAt), [unlockAt]);

  return (
    <GradientCard {...props}>
      <FlexGap gap="8px" p="16px 16px 4px">
        <Flex alignItems="center">
          <img srcSet="/images/cake-staking/token-vecake.png 2x" alt="cross-chain-vecake" width={38} />
          <ChainLogo ml="-8px" chainId={targetChainId} />
        </Flex>
        <Box>
          <Text color="textSubtle" fontSize="15px" bold>
            {t("My veCAKE on %chainName%", {
              chainName: ChainNameMap[targetChainId],
            })}
          </Text>
          <Text mt="-5.5px" bold>
            <BalanceDisplay value={veCakeAmountNum} decimals={veCakeAmountNum < 1 ? 4 : 2} fontSize="21px" bold />
          </Text>
        </Box>
      </FlexGap>
      <Divider />
      <TwoColumns pt="4px" pb="16px" px="16px">
        <Box>
          <Text color="textSubtle" textTransform="uppercase" fontSize="13px" bold>
            {t("CAKE Locked")}
          </Text>
          <Text mt="-4px" bold>
            <BalanceDisplay value={cakeLockedNum} decimals={2} fontSize="21px" bold />
          </Text>
          <Text mt="-4px">
            <BalanceDisplay prefix="~" value={cakeLockedUsdAmount} decimals={2} unit=" USD" fontSize="14px" />
          </Text>
        </Box>
        <Box>
          <Text color="textSubtle" textTransform="uppercase" fontSize="13px" bold>
            {t("Unlocks in")}
          </Text>
          <Text mt="-4px" fontSize="21px" bold>
            {unlockIn}
          </Text>
          <Text mt="-3px" fontSize="13px">
            {t("On %time%", {
              time: unlockDisplay,
            })}
          </Text>
        </Box>
      </TwoColumns>
    </GradientCard>
  );
};
