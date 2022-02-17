import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import BaseCell, { CellContent } from 'views/Pools/components/PoolsTable/Cells/BaseCell'

interface StakedCellProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
  margin-left: 50px;
`

const StakedCell: React.FC<StakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  // vault
  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = pool.vaultKey && hasSharesStaked
  const { cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)

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
