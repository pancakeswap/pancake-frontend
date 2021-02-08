import React from 'react'

import ColumnLabel from './ColumnLabel'

export interface LiquidityProps {
  liquidity: number
}

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  const renderLiquidity = (): string => {
    if (liquidity) {
      return `$${Number(liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }

    return '-'
  }

  return (
    <div>
      <ColumnLabel>
        Liquidity
      </ColumnLabel>
      {renderLiquidity()}
    </div>
  )
}

export default Liquidity