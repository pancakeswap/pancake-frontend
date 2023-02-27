import React, { useMemo } from 'react'
import { Flex, Text, Skeleton, Balance, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { Token } from '@pancakeswap/sdk'

interface TotalStakedCellProps {
  pool: Pool.DeserializedPool<Token>
  totalCakeInVault: BigNumber
  cakeInVaults: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  display: none;
  flex: 2 0 100px;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  pool,
  totalCakeInVault,
  cakeInVaults,
}) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, vaultKey } = pool

  const isManualCakePool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(cakeInVaults)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalCakeInVault, isManualCakePool, totalStaked, stakingToken.decimals, cakeInVaults])

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        <Flex height="20px" alignItems="center">
          {totalCakeInVault && totalCakeInVault.gte(0) ? (
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
