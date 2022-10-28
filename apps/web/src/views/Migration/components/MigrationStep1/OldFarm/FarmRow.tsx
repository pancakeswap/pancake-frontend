import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import ExpandActionCell from 'views/Migration/components/Cells/ExpandActionCell'
import { useFarmUser } from 'state/farmsV1/hooks'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import Farm from '../../Farm/Cells/Farm'
import Staked from '../../Farm/Cells/Staked'
import Earned from '../../Farm/Cells/Earned'
import Multiplier from '../../Farm/Cells/Multiplier'
import Liquidity from '../../Farm/Cells/Liquidity'
import Unstake from './Cells/Unstake'
import ActionPanel from './ActionPanel/ActionPanel'
import { RowProps } from '../../types'

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

const FarmRow: React.FunctionComponent<React.PropsWithChildren<RowProps>> = ({
  farm,
  staked,
  earned,
  multiplier,
  liquidity,
  unstake,
}) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpoints()
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
