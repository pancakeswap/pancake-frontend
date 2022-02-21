import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import ExpandActionCell from 'views/Migration/components/MigrationStep1/OldPool/Cells/ExpandActionCell'
import Farm, { FarmProps } from './Cells/Farm'
import Staked, { StakedProps } from './Cells/Staked'
import Earned, { EarnedProps } from './Cells/Earned'
import Multiplier, { MultiplierProps } from './Cells/Multiplier'
import Liquidity, { LiquidityProps } from './Cells/Liquidity'
import Unstake, { UnstakeProps } from './Cells/Unstake'
import ActionPanel from './ActionPanel/ActionPanel'

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.md} {
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

export interface RowProps {
  earned: EarnedProps
  staked: StakedProps
  farm: FarmProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  unstake: UnstakeProps
}

const FarmRow: React.FunctionComponent<RowProps> = ({ farm, staked, earned, multiplier, liquidity, unstake }) => {
  const { isMobile, isLg, isXl, isXxl } = useMatchBreakpoints()
  const isXLLargerScreen = isXl || isXxl
  const isLargerScreen = isLg || isXLLargerScreen
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

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
          {isLargerScreen || !expanded ? <Staked {...staked} /> : null}
          {isLargerScreen && <Earned {...earned} />}
          {isXLLargerScreen && <Multiplier {...multiplier} />}
          {isXLLargerScreen && <Liquidity {...liquidity} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || !expanded ? <Unstake {...unstake} /> : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
      {!isLargerScreen && shouldRenderActionPanel && (
        <ActionPanel earned={earned} farm={farm} multiplier={multiplier} liquidity={liquidity} expanded={expanded} />
      )}
    </>
  )
}

export default FarmRow
