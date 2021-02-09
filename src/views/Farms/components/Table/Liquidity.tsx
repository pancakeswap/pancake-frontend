import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from '@pancakeswap-libs/uikit'

import CellLayout from './CellLayout'

const LiquidityWrapper = styled.div`
  min-width: 5rem;
  font-weight: 600;
  text-align: left;
`
export interface LiquidityProps {
  liquidity: number
}

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const displayLiquidity = liquidity ? `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : ''

  return (
    <CellLayout label="Liquidity">
      <LiquidityWrapper>
        {displayLiquidity}
      </LiquidityWrapper>
      <HelpIcon color="textSubtle" />
    </CellLayout>
  )
}

export default Liquidity