import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import React from 'react'
import { styled } from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'

const StyledCell = styled(Pool.BaseCell)`
  flex: 0;
  padding: 0 0 24px 0;
  margin-left: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 3;
    padding: 24px 8px;
    margin-left: 30px;
  }
`

export interface StakedProps {
  label: string
  stakedBalance: number
}

const Staked: React.FC<React.PropsWithChildren<StakedProps>> = ({ label, stakedBalance }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const labelText = t('%asset% Staked', { asset: label })

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex mt="4px">
          <Text fontSize={isMobile ? '14px' : '16px'} color={stakedBalance > 0 ? 'text' : 'textDisabled'}>
            ~${stakedBalance.toFixed(2)} USD
          </Text>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default Staked
