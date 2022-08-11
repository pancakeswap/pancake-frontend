import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import ExpandActionCell from 'views/Migration/components/MigrationStep1/OldPool/Cells/ExpandActionCell'
import { useFarmUser } from 'state/farmsV1/hooks'
import { useMatchBreakpointsContext } from '@pancakeswap/uikit'
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

export interface RowProps {
  earned: EarnedProps
  staked: StakedProps
  farm: FarmProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  unstake: UnstakeProps
}

const FarmRow: React.FunctionComponent<React.PropsWithChildren<RowProps>> = ({
  farm,
  staked,
  earned,
  multiplier,
  liquidity,
  unstake,
}) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpointsContext()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const { stakedBalance } = useFarmUser(farm.pid)

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
          {isLargerScreen || !expanded ? (
            <>
              <Staked {...staked} stakedBalance={stakedBalance} />
              <Earned {...earned} />
              <Multiplier {...multiplier} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity {...liquidity} />}
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
