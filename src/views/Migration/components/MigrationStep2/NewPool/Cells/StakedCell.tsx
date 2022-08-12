import { Box, Flex, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from '@pancakeswap/localization'
import React from 'react'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

interface StakedCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  padding: 0 0 24px 0;
  margin-left: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 10px;
    padding: 24px 8px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-left: 20px;
  }
`

const StakedCell: React.FC<React.PropsWithChildren<StakedCellProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  // vault
  const {
    userData: {
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  // pool
  const { stakingTokenPrice, stakingToken, userData } = pool
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const labelText = `${pool.stakingToken.symbol} ${t('Staked')}`
  const hasStaked = pool.vaultKey ? (Number.isNaN(cakeAsNumberBalance) ? 0 : cakeAsNumberBalance) : stakedTokenBalance

  return (
    <StyledCell role="cell" flex={pool.vaultKey ? '1 0 100px' : '2 0 100px'}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={hasStaked ? 'primary' : 'textDisabled'}
              decimals={hasStaked ? 5 : 1}
              value={hasStaked}
            />
            {hasStaked ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={pool.vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                unit=" USD"
              />
            ) : (
              <Text mt="4px" fontSize="12px" color="textDisabled">
                0 USD
              </Text>
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default StakedCell
