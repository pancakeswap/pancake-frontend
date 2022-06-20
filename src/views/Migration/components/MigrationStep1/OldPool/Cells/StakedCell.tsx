import { Box, Flex, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'

interface StakedCellProps {
  pool: DeserializedPool
  account: string
}

const StyledCell = styled(BaseCell)`
  flex: 0;
  padding: 0 0 24px 0;
  margin-left: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 100px;
    margin-left: 10px;
    padding: 24px 8px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-left: 20px;
  }
`

const StakedCell: React.FC<StakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  // vault
  const { vaultPoolData } = useVaultPoolByKeyV1(pool.vaultKey)
  const { pricePerFullShare } = vaultPoolData
  const { userShares } = vaultPoolData.userData
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = pool.vaultKey && hasSharesStaked

  let cakeAsNumberBalance = 0
  if (pricePerFullShare) {
    const { cakeAsNumberBalance: cakeBalance } = convertSharesToCake(userShares, pricePerFullShare)
    cakeAsNumberBalance = cakeBalance
  }

  // pool
  const { stakingToken, userData } = pool
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)

  const labelText = `${pool.stakingToken.symbol} ${t('Staked')}`

  const hasStaked = stakedBalance.gt(0) || isVaultWithShares

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              fontSize={isMobile ? '14px' : '16px'}
              color={hasStaked ? 'text' : 'textDisabled'}
              decimals={hasStaked ? 5 : 1}
              value={pool.vaultKey ? (Number.isNaN(cakeAsNumberBalance) ? 0 : cakeAsNumberBalance) : stakedTokenBalance}
            />
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default StakedCell
