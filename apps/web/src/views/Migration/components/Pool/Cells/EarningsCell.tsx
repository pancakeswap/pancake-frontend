import React from 'react'
import styled from 'styled-components'
import { Text, Flex, useMatchBreakpoints, Balance, Pool } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'

interface EarningsCellProps {
  pool: Pool.DeserializedPool<Token>
  account: string
}

const StyledCell = styled(Pool.BaseCell)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex: 2 0 100px;
  }
`

const EarningsCell: React.FC<React.PropsWithChildren<EarningsCellProps>> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningToken, userData } = pool

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const hasEarnings = account && earnings.gt(0)

  const labelText = t('%asset% Earned', { asset: earningToken.symbol })

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Balance
            mt="4px"
            fontSize={isMobile ? '14px' : '16px'}
            color={hasEarnings ? 'text' : 'textDisabled'}
            decimals={hasEarnings ? 5 : 1}
            value={hasEarnings ? earningTokenBalance : 0}
          />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default EarningsCell
