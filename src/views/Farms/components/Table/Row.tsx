import React from 'react'
import styled from 'styled-components'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import CoinIcon, { CoinIconProps } from './CoinIcon'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'

export interface RowData {
  icon: CoinIconProps
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps,
  details: null
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  icon: CoinIcon,
  multiplier: Multiplier,
  liquidity: Liquidity
}

const CellInner = styled.div`
  padding: 0.3125rem 0rem;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 1rem;
`

const Row: React.FunctionComponent<RowData> = (props) => {
  return (
    <tr>
      {Object.keys(props).map((key) => {
        return (
          <td key={key}>
            <CellInner>{React.createElement(cells[key], props[key])}</CellInner>
          </td>
        )
      })}
    </tr>
  )
}

export default Row
