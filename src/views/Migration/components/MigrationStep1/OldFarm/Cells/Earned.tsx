import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

const StyledCell = styled(BaseCell)`
  display: none;
  flex: 1 0 100px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex: 3;
  }
`

export interface EarnedProps {
  earnings: number
  pid: number
}

const Earned: React.FC<EarnedProps> = ({ earnings }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()
  const labelText = t('%asset% Earned', { asset: 'CAKE' })

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex mt="4px">
          <Text fontSize={isMobile ? '14px' : '16px'} color={earnings > 0 ? 'text' : 'textDisabled'}>
            {earnings.toLocaleString()}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default Earned
