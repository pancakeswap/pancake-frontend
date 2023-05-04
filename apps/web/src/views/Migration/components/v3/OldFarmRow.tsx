import { useMatchBreakpoints } from '@pancakeswap/uikit'
import React, { useState } from 'react'
import { useFarmUser } from 'state/farms/hooks'
import ProxyFarmContainer from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import styled from 'styled-components'
import Earned from '../Farm/Cells/Earned'
import Farm from '../Farm/Cells/Farm'
import Liquidity from '../Farm/Cells/Liquidity'
import Multiplier from '../Farm/Cells/Multiplier'
import Staked from '../Farm/Cells/Staked'
import ExpandActionCell from '../Cells/ExpandActionCell'
import Unstake from '../Farm/Cells/Unstake'
import { RowProps } from '../types'
import UnstableButton from './UnstakeButton'

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

export const V3OldFarmRow: React.FunctionComponent<React.PropsWithChildren<RowProps>> = ({
  farm,
  staked,
  earned,
  multiplier,
  liquidity,
  unstake,
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
              <Staked {...staked} stakedBalance={farm.boosted ? proxy?.stakedBalance : stakedBalance} />
              <Earned {...earned} />
              <Multiplier {...multiplier} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity {...liquidity} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || expanded ? (
            <ProxyFarmContainer farm={farm}>
              <Unstake>
                <UnstableButton {...unstake} />
              </Unstake>
            </ProxyFarmContainer>
          ) : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
    </>
  )
}
