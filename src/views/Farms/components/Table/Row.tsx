import React, { useState } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { useMatchBreakpoints } from '@pancakeswap-libs/uikit'

import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
import { DesktopColumnSchema, MobileColumnSchema } from '../types'

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
`

const Row: React.FunctionComponent<RowProps> = (props) => {
  const { details } = props
  const [actionPanelToggled, setActionPanelToggled] = useState(false)

  const toggleActionPanel = () => {
    setActionPanelToggled(!actionPanelToggled)
  }

  const cellLabel = (key: string): string => {
    if (key === 'farm' || key === 'details') {
      return ''
    }

    return key
  }

  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const tableSchema = isMobile ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  return (
    <>
      <StyledTr onClick={toggleActionPanel}>
        {Object.keys(props).map((key) => {
          if (columnNames.indexOf(key) === -1) {
            return null
          }

          if (key === 'details') {
            return (
              <td key={key}>
                <CellInner>
                  <CellLayout>
                    <Details actionPanelToggled={actionPanelToggled} />
                  </CellLayout>
                </CellInner>
              </td>
            )
          }
          return (
            <td key={key}>
              <CellInner>
                <CellLayout label={cellLabel(key)}>{React.createElement(cells[key], props[key])}</CellLayout>
              </CellInner>
            </td>
          )
        })}
      </StyledTr>
      {actionPanelToggled && details && (
        <tr>
          <td colSpan={6}>
            <ActionPanel {...props} />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
