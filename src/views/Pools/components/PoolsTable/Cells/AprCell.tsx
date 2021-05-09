import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  pool: Pool
  isAutoVault: boolean
  performanceFee: number
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 120px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<AprCellProps> = ({ pool, isAutoVault, performanceFee }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {isAutoVault ? t('APY') : t('APR')}
        </Text>
        <Apr
          pool={pool}
          isAutoVault={isAutoVault}
          performanceFee={isAutoVault ? performanceFee : 0}
          alignItems="flex-start"
        />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
