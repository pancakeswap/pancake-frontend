import React from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'
import Apr from '../Apr'

interface AprCellProps {
  pool: Pool
  performanceFee: number
}

const StyledCell = styled(BaseCell)`
  flex: 1 0 120px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0 0 120px;
  }
`

const AprCell: React.FC<AprCellProps> = ({ pool, performanceFee }) => {
  const { t } = useTranslation()
  const { isAutoVault } = pool
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {isAutoVault ? t('APY') : t('APR')}
        </Text>
        <Apr pool={pool} performanceFee={isAutoVault ? performanceFee : 0} alignItems="flex-start" />
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
