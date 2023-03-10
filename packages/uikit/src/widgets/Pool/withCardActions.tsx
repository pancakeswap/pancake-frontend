import BigNumber from "bignumber.js";

import styled from "styled-components";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { useTranslation } from "@pancakeswap/localization";
import { Flex, Text, Box } from "../../components";
import { DeserializedPool } from "./types";

const InlineText = styled((props) => <Text {...props} />)`
  display: inline;
`;

interface CardActionsProps<T> {
  pool: DeserializedPool<T>;
  stakedBalance?: BigNumber;
  hideLocateAddress?: boolean;
}

export function withTableActions<T>(HarvestActionsComp: any, StakeActionsComp: any) {
  return ({
    pool,
    stakedBalance,
    hideLocateAddress = false,
    ...rest
  }: {
    pool: DeserializedPool<T>;
    account?: string;
    hideLocateAddress?: boolean;
    stakedBalance?: BigNumber;
  }) => {
    const { sousId, stakingToken, earningToken, userData, earningTokenPrice } = pool;

    const isBnbPool = false;
    const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
    const isLoading = !userData;
    const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO;
    const isStaked = stakedBalance?.gt(0);

    return (
      <>
        <HarvestActionsComp
          earnings={earnings}
          stakingTokenAddress={stakingToken.address}
          earningTokenAddress={earningToken.address}
          earningTokenSymbol={earningToken.symbol}
          earningTokenDecimals={earningToken.decimals}
          sousId={sousId}
          earningTokenPrice={earningTokenPrice}
          isBnbPool={isBnbPool}
          isLoading={isLoading}
          poolAddress={pool.contractAddress}
          {...rest}
        />
        <StakeActionsComp
          isLoading={isLoading}
          pool={pool}
          stakingTokenBalance={stakingTokenBalance}
          stakedBalance={stakedBalance}
          isBnbPool={isBnbPool}
          isStaked={isStaked}
          hideLocateAddress={hideLocateAddress}
          stakingTokenSymbol={stakingToken.symbol}
          {...rest}
        />
      </>
    );
  };
}

export function withCardActions<T>(HarvestActionsComp: any, StakeActionsComp: any) {
  return ({ pool, stakedBalance, hideLocateAddress = false }: CardActionsProps<T>) => {
    const { sousId, stakingToken, earningToken, userData, earningTokenPrice } = pool;

    const isBnbPool = false;
    const { t } = useTranslation();
    const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO;
    const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO;
    const isStaked = stakedBalance?.gt(0);
    const isLoading = !userData;

    return (
      <Flex flexDirection="column">
        <Flex flexDirection="column">
          <>
            <Box display="inline">
              <InlineText color="secondary" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t("Earned")}
              </InlineText>
            </Box>
            <HarvestActionsComp
              earnings={earnings}
              stakingTokenAddress={stakingToken.address}
              earningTokenAddress={earningToken.address}
              earningTokenSymbol={earningToken.symbol}
              earningTokenDecimals={earningToken.decimals}
              sousId={sousId}
              earningTokenPrice={earningTokenPrice}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
              poolAddress={pool.contractAddress}
            />
          </>
          <Box display="inline">
            <InlineText color={isStaked ? "secondary" : "textSubtle"} textTransform="uppercase" bold fontSize="12px">
              {isStaked ? stakingToken.symbol : t("Stake")}{" "}
            </InlineText>
            <InlineText color={isStaked ? "textSubtle" : "secondary"} textTransform="uppercase" bold fontSize="12px">
              {isStaked ? t("Staked") : `${stakingToken.symbol}`}
            </InlineText>
          </Box>
          <StakeActionsComp
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
            hideLocateAddress={hideLocateAddress}
          />
        </Flex>
      </Flex>
    );
  };
}
