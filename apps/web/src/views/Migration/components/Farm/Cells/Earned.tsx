import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const StyledCell = styled(Pool.BaseCell)`
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

const Earned: React.FC<React.PropsWithChildren<EarnedProps>> = ({ earnings }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const labelText = t('%asset% Earned', { asset: 'CAKE' })

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex mt="4px">
          <Text fontSize={isMobile ? '14px' : '16px'} color={earnings > 0 ? 'text' : 'textDisabled'}>
            {earnings.toLocaleString()}
          </Text>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Earned
