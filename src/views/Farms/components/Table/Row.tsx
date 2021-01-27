import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

import Apy from './Apy'
import Pool from './Pool'
import Earned from './Earned'
import Staked from './Staked'
import Details from './Details'
import Links from './Links'

export interface RowData {
  apy: {
    value: number
    multiplier: string
  }
  pool: {
    image: string
    label: string
  }
  earned: {
    earnings: number
    pid: number
  }
  staked: FarmWithStakedValue
  details: {
    liquidity: number
    lpName: string
    liquidityUrlPathParts: string
  }
  links: {
    bsc: string
  }
}

const cells = {
  apy: Apy,
  pool: Pool,
  earned: Earned,
  staked: Staked,
  details: Details,
  links: Links,
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
