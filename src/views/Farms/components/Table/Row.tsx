import React from 'react'
import styled from 'styled-components'

import Apy from './Apy'
import Pool from './Pool'
import Earned from './Earned'
import Staked from './Staked'
import Details from './Details'
import Links from './Links'

interface RowData {
  data: {
    apy: {
      value: string;
      multiplier: string;
    }
    pool: {
      image: string;
      label: string;
    }
    earned: any
    staked: any
    details: {
      liquidity: string
    }
    links: {
      bsc: string
    }
  }
}

const cells = {
  apy: Apy,
  pool: Pool,
  earned: Earned,
  staked: Staked,
  details: Details,
  links: Links
}

const CellInner = styled.div`
  padding: 0.3125rem 0rem;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 1rem;
`

const Row: React.FunctionComponent<RowData> = ({ data }) => {

  return (
    <tr>
      {
        Object.keys(data).map((key) => {
          return (
            <td key={key}>
              <CellInner>
                {React.createElement(cells[key], data[key])}
              </CellInner>
            </td>
          )
        })
      }
    </tr>
  )
}

export default Row