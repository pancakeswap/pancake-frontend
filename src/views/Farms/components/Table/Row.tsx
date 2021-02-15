import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Staked from './Staked'
import Details, { DetailsProps } from './Details'
import Links, { LinksProps } from './Links'
import CoinIcon, { CoinIconProps } from './CoinIcon'

export interface RowData {
  icon: CoinIconProps
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  staked: FarmWithStakedValue
  details: DetailsProps
  links: LinksProps
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  staked: Staked,
  details: Details,
  links: Links,
  icon: CoinIcon,
}

const CellInner = styled.div`
  padding: 5px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 16px;
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
