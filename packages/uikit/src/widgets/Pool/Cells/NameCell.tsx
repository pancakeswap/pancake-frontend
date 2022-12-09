import BigNumber from "bignumber.js";
import { useTranslation } from "@pancakeswap/localization";
import React, { useMemo, ReactNode } from "react";
import styled from "styled-components";
import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { DeserializedPool } from "../types";
import { BaseCell, CellContent } from "./BaseCell";
import { Text, Skeleton } from "../../../components";
import useMatchBreakpoints from "../../../contexts/MatchBreakpoints/useMatchBreakpoints";

interface NameCellProps<T> {
  pool: DeserializedPool<T>;
  userShares?: BigNumber;
  totalCakeInVault?: BigNumber;
  tokenPairImage: ReactNode;
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
`;

export function NameCell<T>({ pool, totalCakeInVault, userShares, tokenPairImage }: NameCellProps<T>) {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  const { sousId, stakingToken, earningToken, userData, isFinished, vaultKey, totalStaked } = pool;
  const hasVaultShares = userShares?.gt(0);

  const stakingTokenSymbol = stakingToken.symbol;
  const earningTokenSymbol = earningToken.symbol;

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO;
  const isStaked = stakedBalance.gt(0);

  const showStakedTag = vaultKey ? hasVaultShares : isStaked;

  const title: React.ReactNode = `${t("Earn")} ${earningTokenSymbol}`;
  const subtitle: React.ReactNode = `${t("Stake")} ${stakingTokenSymbol}`;
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isMobile);

  const isLoaded = useMemo(() => {
    if (pool.vaultKey) {
      return totalCakeInVault && totalCakeInVault.gte(0);
    }
    return totalStaked && totalStaked.gte(0);
  }, [pool.vaultKey, totalCakeInVault, totalStaked]);

  return (
    <StyledCell role="cell">
      {isLoaded ? (
        <>
          {tokenPairImage}
          <CellContent>
            {showStakedTag && (
              <Text fontSize="12px" bold color={isFinished ? "failure" : "secondary"} textTransform="uppercase">
                {t("Staked")}
              </Text>
            )}
            <Text bold={!isMobile} small={isMobile}>
              {title}
            </Text>
            {showSubtitle && (
              <Text fontSize="12px" color="textSubtle">
                {subtitle}
              </Text>
            )}
          </CellContent>
        </>
      ) : (
        <>
          <Skeleton mr="8px" width={36} height={36} variant="circle" />
          <CellContent>
            <Skeleton width={30} height={12} mb="4px" />
            <Skeleton width={65} height={12} />
          </CellContent>
        </>
      )}
    </StyledCell>
  );
}
