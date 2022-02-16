import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import Farm, { FarmProps } from 'views/Farms/components/FarmTable/Farm'
import Earned, { EarnedProps } from 'views/Farms/components/FarmTable/Earned'
import Multiplier, { MultiplierProps } from 'views/Farms/components/FarmTable/Multiplier'
import Liquidity, { LiquidityProps } from 'views/Farms/components/FarmTable/Liquidity'
import CellLayout from 'views/Farms/components/FarmTable/CellLayout'
import Staked, { StakedProps } from './Staked'
import { DesktopColumnSchema, MobileColumnSchema } from '../../types'

export interface RowProps {
  earned: EarnedProps
  staked: StakedProps
  farm: FarmProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  earned: Earned,
  farm: Farm,
  staked: Staked,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  width: 100%;
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-right: 32px;
  }
`

const StyledTr = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

const Row: React.FunctionComponent<RowPropsWithLoading> = (props) => {
  const { userDataReady } = props
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)

  return (
    <>
      <StyledTr>
        {Object.keys(props).map((key) => {
          const columnIndex = columnNames.indexOf(key)
          if (columnIndex === -1) {
            return null
          }

          return (
            <td key={key}>
              <CellInner>
                <CellLayout label={t(tableSchema[columnIndex].label)}>
                  {React.createElement(cells[key], { ...props[key], userDataReady })}
                </CellLayout>
              </CellInner>
            </td>
          )
        })}
      </StyledTr>
    </>
  )
}

export default Row
