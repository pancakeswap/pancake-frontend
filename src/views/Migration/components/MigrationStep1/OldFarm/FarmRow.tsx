import React from 'react'
import styled from 'styled-components'
import Farm, { FarmProps } from './Cells/Farm'
import Staked, { StakedProps } from './Cells/Staked'
import Earned, { EarnedProps } from './Cells/Earned'
import Multiplier, { MultiplierProps } from './Cells/Multiplier'
import Liquidity, { LiquidityProps } from './Cells/Liquidity'
import Unstake, { UnstakeProps } from './Cells/Unstake'

const StyledRow = styled.div`
  display: flex;
  background-color: transparent;
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
  return (
    <>
      <StyledRow role="row">
        <Farm {...farm} />
        <Staked {...staked} />
        <Earned {...earned} />
        <Multiplier {...multiplier} />
        <Liquidity {...liquidity} />
        <Unstake {...unstake} />
      </StyledRow>
    </>
  )
}

export default FarmRow
