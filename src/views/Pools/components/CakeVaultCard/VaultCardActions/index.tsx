import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool, VaultKey } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { useIfoPoolIfo } from 'state/pools/hooks'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

const IfoVaultCardAction = ({ pool }: { pool: DeserializedPool }) => {
  const { t } = useTranslation()
  const ifoInfo = useIfoPoolIfo()
  const cakeAsNumberBalance = getBalanceNumber(ifoInfo.lastAvgBalance)
  const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance))
  const cakePriceBusd = usePriceCakeBusd()
  const stakedDollarValue = cakePriceBusd.gt(0)
    ? getBalanceNumber(cakeAsBigNumber.multipliedBy(cakePriceBusd), pool.stakingToken.decimals)
    : 0

  return (
    <>
      <Box display="inline">
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {t('Average')}{' '}
        </InlineText>
        <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Pool Balance')}
        </InlineText>
      </Box>
      <Flex flexDirection="column">
        <Balance fontSize="20px" bold value={cakeAsNumberBalance} decimals={5} />
        <Text fontSize="12px" color="textSubtle">
          {cakePriceBusd.gt(0) ? (
            <Balance value={stakedDollarValue} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
          ) : (
            <Skeleton mt="1px" height={16} width={64} />
          )}
        </Text>
      </Flex>
    </>
  )
}

const CakeVaultCardActions: React.FC<{
  pool: DeserializedPool
  accountHasSharesStaked: boolean
  isLoading: boolean
  performanceFee: number
}> = ({ pool, accountHasSharesStaked, isLoading, performanceFee }) => {
  const { stakingToken, userData } = pool
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(pool.vaultKey)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {accountHasSharesStaked && pool.vaultKey === VaultKey.IfoPool && <IfoVaultCardAction pool={pool} />}
        <Box display="inline">
          <InlineText
            color={accountHasSharesStaked ? 'secondary' : 'textSubtle'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? t('Staked (compounding)') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={accountHasSharesStaked}
            performanceFee={performanceFee}
          />
        ) : (
          <VaultApprovalAction vaultKey={pool.vaultKey} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
