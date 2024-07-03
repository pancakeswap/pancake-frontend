import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import React, { useState } from 'react'
import { useFarmUser } from 'state/farms/hooks'
import { styled } from 'styled-components'
import ProxyFarmContainer from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import noop from 'lodash/noop'
import ExpandActionCell from '../Cells/ExpandActionCell'
import Earned from '../Farm/Cells/Earned'
import Farm from '../Farm/Cells/Farm'
import Liquidity from '../Farm/Cells/Liquidity'
import Multiplier from '../Farm/Cells/Multiplier'
import Staked from '../Farm/Cells/Staked'
import Unstake from '../Farm/Cells/Unstake'
import V2StakeButton from '../bCake/V2StakedButton'
import { RowProps } from '../types'
import UnstakeButton from './UnstakeButton'

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

export const V3OldFarmRow: React.FunctionComponent<React.PropsWithChildren<RowProps & { step?: number }>> = ({
  farm,
  staked,
  earned,
  multiplier,
  liquidity,
  unstake,
  step,
}) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(true)

  const { stakedBalance, proxy } = useFarmUser(farm.pid)

  const toggleExpanded = () => {
    if (!isLargerScreen) {
      setExpanded((prev) => !prev)
    }
  }

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <LeftContainer>
          <Farm {...farm} />
          {isLargerScreen || expanded ? (
            <>
              <Staked
                {...staked}
                stakedBalance={
                  step === 2
                    ? farm.bCakeUserData?.stakedBalance ?? BIG_ZERO
                    : farm.boosted && proxy?.stakedBalance.gt(0)
                    ? proxy?.stakedBalance ?? BIG_ZERO
                    : stakedBalance
                }
              />
              <Earned
                {...earned}
                earnings={
                  step === 2
                    ? getBalanceNumber(farm.bCakeUserData?.earnings)
                    : getBalanceNumber(farm.boosted && proxy?.earnings.gt(0) ? proxy.earnings : farm.userData?.earnings)
                }
              />
              <Multiplier {...multiplier} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity {...liquidity} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || expanded ? (
            <ProxyFarmContainer farm={farm}>
              <Unstake>
                {step === 2 ? (
                  <V2StakeButton
                    onDone={noop}
                    wrapperAddress={farm.bCakeWrapperAddress}
                    lpSymbol={farm.label}
                    pid={farm.pid}
                  />
                ) : (
                  <UnstakeButton {...unstake} />
                )}
              </Unstake>
            </ProxyFarmContainer>
          ) : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
    </>
  )
}
