import { useCallback, useMemo } from "react";
import { styled, css } from "styled-components";

import { useTranslation } from "@pancakeswap/localization";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import {
  Box,
  Text,
  CalculateIcon,
  Skeleton,
  FlexProps,
  Button,
  RoiCalculatorModal,
  Balance,
  BalanceWithLoading,
  useModal,
  Flex,
  RocketIcon,
  useMatchBreakpoints,
  useTooltip,
} from "@pancakeswap/uikit";

import { DeserializedPool } from "./types";

const AprLabelContainer = styled(Flex)<{ enableHover: boolean }>`
  ${({ enableHover }) =>
    enableHover
      ? css`
          &:hover {
            opacity: 0.5;
          }
        `
      : null}
`;

interface AprProps<T> extends FlexProps {
  pool: DeserializedPool<T>;
  stakedBalance: BigNumber;
  showIcon: boolean;
  performanceFee?: number;
  fontSize?: string;
  shouldShowApr: boolean;
  account: string;
  autoCompoundFrequency: number;
}

export function Apr<T>({
  pool,
  showIcon,
  stakedBalance,
  fontSize = "16px",
  performanceFee = 0,
  shouldShowApr,
  account,
  autoCompoundFrequency,
  ...props
}: AprProps<T>) {
  const {
    stakingToken,
    earningToken,
    isFinished,
    earningTokenPrice,
    stakingTokenPrice,
    userData,
    apr,
    rawApr,
    vaultKey,
  } = pool;
  const { t } = useTranslation();
  const { isDesktop } = useMatchBreakpoints();

  const stakingTokenBalance = useMemo(
    () => (userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO),
    [userData]
  );

  const apyModalLink = useMemo(
    () => (stakingToken?.address ? `/swap?outputCurrency=${stakingToken.address}` : "/swap"),
    [stakingToken]
  );

  const boostedApr = pool?.boostedApr ?? 0;

  const poolApr = useMemo(() => {
    const currentApr = vaultKey ? rawApr : apr;
    if (boostedApr) {
      return new BigNumber(currentApr ?? 0).plus(boostedApr).toNumber();
    }

    return currentApr ?? 0;
  }, [apr, boostedApr, rawApr, vaultKey]);

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      earningTokenPrice={earningTokenPrice || 0}
      stakingTokenPrice={stakingTokenPrice || 0}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      stakingTokenDecimals={stakingToken.decimals}
      apr={poolApr}
      stakingTokenSymbol={stakingToken?.symbol || ""}
      linkLabel={t("Get %symbol%", { symbol: stakingToken?.symbol || "" })}
      linkHref={apyModalLink}
      earningTokenSymbol={earningToken?.symbol}
      autoCompoundFrequency={autoCompoundFrequency}
      performanceFee={performanceFee}
    />
  );

  const openRoiModal = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onPresentApyModal();
    },
    [onPresentApyModal]
  );

  const isValidate = apr !== undefined && !Number.isNaN(apr);

  const tooltipStakeApy = useMemo(() => {
    const currentApr = vaultKey ? rawApr : apr;
    return `${currentApr?.toFixed(2)}%` ?? "0%";
  }, [vaultKey, rawApr, apr]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box>
        <Box>
          <Text bold as="span">
            {t("Total APY:")}
          </Text>
          <Text bold as="span" ml="4px">
            {`${poolApr?.toFixed(2)}%`}
          </Text>
        </Box>
        <Box>
          <Text bold as="span">
            {t("Fee APY:")}
          </Text>
          <Text bold as="span" ml="4px">
            {`${boostedApr?.toFixed(2)}%`}
          </Text>
        </Box>
        <Box>
          <Text bold as="span">
            {t("Stake APY:")}
          </Text>
          <Text bold as="span" ml="4px">
            {tooltipStakeApy}
          </Text>
        </Box>
      </Box>
      <Text mt="10px" lineHeight="120%">
        {t(
          "Fee APY include the transaction fees shared in the ALP pool, funding rates for positions held, and liquidation income, and will be reflected in the growth of the ALP price. Stake APY is the return for staking ALP. Both Annualized using compound interest, for reference purposes only."
        )}
      </Text>
    </Box>,
    {
      placement: "top",
    }
  );

  return (
    <AprLabelContainer enableHover={!isFinished} alignItems="center" justifyContent="flex-start" {...props}>
      {isValidate || isFinished ? (
        <>
          {shouldShowApr ? (
            <Flex ref={targetRef}>
              {!isFinished && boostedApr > 0 && (
                <>
                  {tooltipVisible && tooltip}
                  <Flex
                    m="0 4px 0 0"
                    alignSelf="center"
                    flexDirection={showIcon ? ["row"] : ["column", "column", "row"]}
                  >
                    {isDesktop && <RocketIcon color="success" />}
                    <Text color="success" bold mr="2px">
                      {t("Up to")}
                    </Text>
                    <Balance bold unit="%" color="success" decimals={2} value={poolApr} />
                  </Flex>
                </>
              )}
              {((isDesktop && boostedApr > 0) || boostedApr === 0) && (
                <BalanceWithLoading
                  onClick={(event) => {
                    if (!showIcon || isFinished) return;
                    openRoiModal(event);
                  }}
                  fontSize={fontSize}
                  isDisabled={isFinished}
                  strikeThrough={boostedApr > 0}
                  value={isFinished ? 0 : apr ?? 0}
                  decimals={2}
                  unit="%"
                />
              )}
              {!isFinished && showIcon && (
                <Button onClick={openRoiModal} variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
                  <CalculateIcon color="textSubtle" width="20px" />
                </Button>
              )}
            </Flex>
          ) : (
            <Text>-</Text>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </AprLabelContainer>
  );
}
