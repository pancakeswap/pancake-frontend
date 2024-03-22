import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import React, { useState } from 'react'
import { styled } from 'styled-components'
import ExpandActionCell from '../Cells/ExpandActionCell'
import Earned from '../Farm/Cells/Earned'
import Farm from '../Farm/Cells/Farm'
import Liquidity from '../Farm/Cells/Liquidity'
import Staked from '../Farm/Cells/Staked'
import Unstake from '../Farm/Cells/Unstake'
import { RowProps } from '../types'
import UnstableButton from '../v3/UnstakeButton'

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

export const PositionManagerFarmRow: React.FunctionComponent<React.PropsWithChildren<RowProps>> = ({
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
              <Staked {...staked} stakedBalance={BIG_ZERO} />
              <Earned {...earned} />
            </>
          ) : null}
          {isLargerScreen && <Liquidity {...liquidity} />}
        </LeftContainer>
        <RightContainer>
          {isLargerScreen || expanded ? (
            <Unstake>
              <UnstableButton {...unstake} />
            </Unstake>
          ) : null}
          {!isLargerScreen && <ExpandActionCell expanded={expanded} showExpandedText={expanded || isMobile} />}
        </RightContainer>
      </StyledRow>
    </>
  )
}
