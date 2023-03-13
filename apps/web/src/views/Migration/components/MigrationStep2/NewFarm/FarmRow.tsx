import React, { useState } from 'react'
import styled from 'styled-components'
import Farm from 'views/Migration/components/Farm/Cells/Farm'
import Staked from 'views/Migration/components/Farm/Cells/Staked'
import Multiplier from 'views/Migration/components/Farm/Cells/Multiplier'
import Liquidity from 'views/Migration/components/Farm/Cells/Liquidity'
import { useFarmUser } from 'state/farms/hooks'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useDelayedUnmount } from '@pancakeswap/hooks'
import AprCell from './Cells/AprCell'
import StakeButtonCells from './Cells/StakeButtonCells'
import StakeButton from './StakeButton'
import ActionPanel from './ActionPanel/ActionPanel'
import { RowProps } from '../../types'
import ExpandActionCell from '../../Cells/ExpandActionCell'

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
  earned,
  farm,
  staked,
  apr,
  multiplier,
  liquidity,
}) => {
  const { isMobile, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')

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
              <AprCell {...apr} />
              <Multiplier {...multiplier} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity {...liquidity} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || !expanded ? (
            <StakeButtonCells>
              <StakeButton {...farm} lpLabel={lpLabel} displayApr={apr.value} />
            </StakeButtonCells>
          ) : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
      {!isLargerScreen && shouldRenderActionPanel && (
        <ActionPanel
          farm={farm}
          earned={earned}
          apr={apr}
          multiplier={multiplier}
          liquidity={liquidity}
          expanded={expanded}
        />
      )}
    </>
  )
}

export default FarmRow
