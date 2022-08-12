import React from 'react'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useVaultPoolByKeyV1 } from 'views/Migration/hook/V1/Pool/useFetchIfoPool'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import UnstakeButton from '../UnstakeButton'

const Container = styled(ActionContainer)`
  flex: 3;
`

interface StackedActionProps {
  pool: DeserializedPool
}

const Staked: React.FC<React.PropsWithChildren<StackedActionProps>> = ({ pool }) => {
  const { stakingToken, userData, stakingTokenPrice, vaultKey } = pool
  const { t } = useTranslation()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const { vaultPoolData } = useVaultPoolByKeyV1(pool.vaultKey)
  const { pricePerFullShare } = vaultPoolData
  const { userShares } = vaultPoolData.userData

  let cakeAsBigNumber = new BigNumber(0)
  let cakeAsNumberBalance = 0
  if (pricePerFullShare) {
    const { cakeAsBigNumber: cakeBigBumber, cakeAsNumberBalance: cakeBalance } = convertSharesToCake(
      userShares,
      pricePerFullShare,
    )
    cakeAsBigNumber = cakeBigBumber
    cakeAsNumberBalance = cakeBalance
  }

  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const balance = vaultKey ? (Number.isNaN(cakeAsNumberBalance) ? 0 : cakeAsNumberBalance) : stakedTokenBalance
  const isBalanceZero = balance === 0

  return (
    <Container>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {`${pool.stakingToken.symbol} ${t('Staked')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance
            lineHeight="1"
            bold
            color={isBalanceZero ? 'textDisabled' : 'text'}
            fontSize="20px"
            decimals={5}
            value={balance}
          />
          <Balance
            fontSize="12px"
            display="inline"
            color={isBalanceZero ? 'textDisabled' : 'textSubtle'}
            decimals={2}
            value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
            unit=" USD"
            prefix="~"
          />
        </Flex>
        <UnstakeButton pool={pool} />
      </ActionContent>
    </Container>
  )
}

export default Staked
