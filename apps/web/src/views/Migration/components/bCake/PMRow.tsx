import { MANAGER } from '@pancakeswap/position-managers'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import React, { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { Address } from 'viem'
import {
  useEarningTokenPriceInfo,
  usePositionInfo,
  useTotalAssetInUsd,
  useTotalStakedInUsd,
} from 'views/PositionManagers/hooks/'
import ExpandActionCell from '../Cells/ExpandActionCell'
import Earned from './Earned'
import Liquidity from './Liquidity'
import Farm from './PMInfo'
import Staked from './Staked'
import StakeButton from './StakedButton'
import Unstake from './Unstake'
import UnStakeButton from './UnstakeButton'

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.lg} {
    cursor: initial;
  }
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const RightContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
  }
`

type PMRowProps = {
  data: {
    label: string
    token: Token
    quoteToken: Token
    manager: MANAGER
    wrapperAddress: Address
    adapterAddress: Address
    bCakeWrapperAddress: Address
    earningToken: Token
  }
  step: number
}

export const PositionManagerFarmRow: React.FunctionComponent<React.PropsWithChildren<PMRowProps>> = ({
  data,
  step,
}) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(true)
  const toggleExpanded = () => {
    if (!isLargerScreen) {
      setExpanded((prev) => !prev)
    }
  }
  const { wrapperAddress, adapterAddress, token, quoteToken, earningToken, label, bCakeWrapperAddress } = data

  const info = usePositionInfo(step === 1 ? wrapperAddress : bCakeWrapperAddress, adapterAddress, false)
  const { data: token0USDPrice } = useCurrencyUsdPrice(token)
  const { data: token1USDPrice } = useCurrencyUsdPrice(quoteToken)
  const tokensPriceUSD = useMemo(() => {
    return {
      token0: token0USDPrice ?? 0,
      token1: token1USDPrice ?? 0,
    }
  }, [token0USDPrice, token1USDPrice])
  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA: token,
    currencyB: quoteToken,
    poolToken0Amount: info?.poolToken0Amounts,
    poolToken1Amount: info?.poolToken1Amounts,
    token0PriceUSD: tokensPriceUSD?.token0,
    token1PriceUSD: tokensPriceUSD?.token1,
  })
  const staked0Amount = info?.userToken0Amounts
    ? CurrencyAmount.fromRawAmount(token, info.userToken0Amounts)
    : undefined
  const staked1Amount = info?.userToken1Amounts
    ? CurrencyAmount.fromRawAmount(quoteToken, info.userToken1Amounts)
    : undefined
  const totalAssetsInUsd = useTotalAssetInUsd(
    staked0Amount,
    staked1Amount,
    tokensPriceUSD?.token0,
    tokensPriceUSD?.token1,
  )
  const { earningsBalance } = useEarningTokenPriceInfo(earningToken, info?.pendingReward)
  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <LeftContainer>
          <Farm {...data} />
          {isLargerScreen || expanded ? (
            <>
              <Staked label="Liquidity" stakedBalance={totalAssetsInUsd} />
              <Earned earnings={earningsBalance ?? 0} rewardToken={earningToken} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity liquidity={totalStakedInUsd} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || expanded ? (
            <>
              <Unstake>
                {step === 1 ? (
                  <UnStakeButton
                    userStakedLp={info?.userLpAmounts}
                    wrapperAddress={wrapperAddress}
                    onDone={info?.refetchPositionInfo}
                  />
                ) : (
                  <StakeButton
                    bCakeWrapperAddress={bCakeWrapperAddress}
                    vaultAddress={info?.vaultAddress}
                    lpSymbol={label}
                    onDone={info?.refetchPositionInfo}
                  />
                )}
              </Unstake>
            </>
          ) : null}

          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
    </>
  )
}
