import React, { useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

const StyledCell = styled(BaseCell)`
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
  pid: number
  stakedBalance: BigNumber
}

const Staked: React.FC<StakedProps> = ({ label, stakedBalance }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const labelText = t('%asset% Staked', { asset: label })

  const displayBalance = useCallback(() => {
    const stakedBalanceBigNumber = getBalanceAmount(stakedBalance)
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0000001)) {
      return stakedBalanceBigNumber.toFixed(10, BigNumber.ROUND_DOWN)
    }
    if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
      return getFullDisplayBalance(stakedBalance).toLocaleString()
    }
    return stakedBalanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN)
  }, [stakedBalance])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex mt="4px">
          <Text fontSize={isMobile ? '14px' : '16px'} color={stakedBalance.gt(0) ? 'text' : 'textDisabled'}>
            {displayBalance()}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default Staked
