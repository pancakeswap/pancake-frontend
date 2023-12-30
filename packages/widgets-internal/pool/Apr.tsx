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
  AlpIcon,
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

const GradientText = styled(Text)`
  background-clip: text;
  background: linear-gradient(115deg, #c040fc -17.9%, #4b3cff 100.68%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  boostedApr?: number;
  boostedTooltipsText?: string;
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
  boostedApr = 0,
  boostedTooltipsText,
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
    return `${currentApr?.toLocaleString("en-US", { maximumFractionDigits: 2 })}%` ?? "0%";
  }, [vaultKey, rawApr, apr]);

  const boostedAprGreaterThanZero = useMemo(() => new BigNumber(boostedApr ?? 0).isGreaterThan(0), [boostedApr]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box>
        <Box>
          <Text bold as="span">
            {t("Total APY:")}
          </Text>
          <Text bold as="span" ml="4px">
            {`${poolApr?.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`}
          </Text>
        </Box>
        <Box>
          <Text bold as="span">
            {t("Fee APY:")}
          </Text>
          <Text bold as="span" ml="4px">
            {`${boostedApr?.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`}
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
      {boostedTooltipsText && (
        <Text mt="10px" lineHeight="120%">
          {boostedTooltipsText}
        </Text>
      )}
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
            <Flex>
              <Flex position="relative" zIndex={0} ref={targetRef}>
                {!isFinished && boostedAprGreaterThanZero && (
                  <>
                    {tooltipVisible && tooltip}
                    <Flex m="0 4px 0 0" flexDirection={showIcon ? ["row"] : ["column", "column", "row"]}>
                      {isDesktop && <AlpIcon m="-4px 3px 0 0" />}
                      <GradientText fontSize={fontSize} bold mr="2px">
                        {t("Up to")}
                      </GradientText>
                      <Balance fontSize={fontSize} bold unit="%" color="#4B3CFF" decimals={2} value={poolApr} />
                    </Flex>
                  </>
                )}
                {((isDesktop && boostedAprGreaterThanZero) || boostedApr === 0 || showIcon) && (
                  <BalanceWithLoading
                    onClick={(event) => {
                      if (!showIcon || isFinished) return;
                      openRoiModal(event);
                    }}
                    fontSize={fontSize}
                    isDisabled={isFinished}
                    strikeThrough={boostedAprGreaterThanZero}
                    value={isFinished ? 0 : apr ?? 0}
                    decimals={2}
                    unit="%"
                  />
                )}
              </Flex>
              {!isFinished && showIcon && (
                <Button
                  variant="text"
                  width="20px"
                  height="20px"
                  padding="0px"
                  marginLeft="4px"
                  style={{ position: "relative", zIndex: 1 }}
                  onClick={openRoiModal}
                >
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
