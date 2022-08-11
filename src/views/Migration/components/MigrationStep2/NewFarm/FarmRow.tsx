import React, { useState } from 'react'
import styled from 'styled-components'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { AprProps } from 'views/Farms/components/FarmTable/Apr'
import Farm, { FarmProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Farm'
import Staked, { StakedProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Staked'
import { EarnedProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Earned'
import Multiplier, { MultiplierProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Multiplier'
import Liquidity, { LiquidityProps } from 'views/Migration/components/MigrationStep1/OldFarm/Cells/Liquidity'
import ExpandActionCell from 'views/Migration/components/MigrationStep1/OldPool/Cells/ExpandActionCell'
import { useFarmUser } from 'state/farms/hooks'
import { useMatchBreakpointsContext } from '@pancakeswap/uikit'
import AprCell from './Cells/AprCell'
import StakeButtonCells from './Cells/StakeButtonCells'
import StakeButton from './StakeButton'
import ActionPanel from './ActionPanel/ActionPanel'

export interface RowProps {
  farm: FarmProps
  apr: AprProps
  earned: EarnedProps
  staked: StakedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
}

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
  const { isMobile, isXl, isXxl } = useMatchBreakpointsContext()
  const isLargerScreen = isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')

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
