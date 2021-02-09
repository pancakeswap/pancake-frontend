import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import CoinIcon, { CoinIconProps } from './CoinIcon'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './ActionPanel'

export interface RowData {
  icon: CoinIconProps
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps,
  details: FarmWithStakedValue
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
  padding-right: 3rem;
`

const Row: React.FunctionComponent<RowData> = (props) => {
  const { details } = props;

  return (
    <>
    <tr>
      {Object.keys(props).map((key) => {
        return (
          <td key={key}>
            <CellInner>{React.createElement(cells[key], props[key])}</CellInner>
          </td>
        )
      })}
    </tr>
    <tr>
      <td colSpan={7}>
        <ActionPanel farm={details} />
      </td>
    </tr>
    </>
  )
}

export default Row
