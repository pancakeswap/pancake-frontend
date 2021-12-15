import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool, VaultKey } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { useIfoPoolCredit, useIfoPoolVault } from 'state/pools/hooks'
import { usePriceCakeBusd } from 'state/farms/hooks'
import QuestionHelper from 'components/QuestionHelper'
import { FlexGap } from 'components/Layout/Flex'
import { getBalanceNumber, getDecimalAmount } from 'utils/formatBalance'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

export const IfoVaultCardAvgBalance = ({ pool }: { pool: DeserializedPool }) => {
  const { t } = useTranslation()
  const {
    totalShares,
    userData: { userShares, isLoading },
  } = useIfoPoolVault()
  const credit = useIfoPoolCredit()

  // TODO: refactor this is use everywhere
  const cakeAsNumberBalance = getBalanceNumber(credit)
  const cakeAsBigNumber = getDecimalAmount(new BigNumber(cakeAsNumberBalance))
  const cakePriceBusd = usePriceCakeBusd()
  const stakedDollarValue = cakePriceBusd.gt(0)
    ? getBalanceNumber(cakeAsBigNumber.multipliedBy(cakePriceBusd), pool.stakingToken.decimals)
    : 0

  const totalSharesPercentage =
    userShares &&
    userShares.gt(0) &&
    totalShares &&
    userShares.dividedBy(totalShares).multipliedBy(100).decimalPlaces(5)

  return (
    <>
      <FlexGap gap="4px" alignItems="center">
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {t('Average')}{' '}
        </InlineText>
        <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Pool Balance')}
        </InlineText>
        <QuestionHelper
          size="24px"
          placement="auto"
          display="inline"
          text={t(
            'Max CAKE entry for both IFO sale is capped by average pool balance in this pool. This is calculated by the average block balance in the IFO pool in the past blocks prior to cut-off block.',
          )}
        />
      </FlexGap>
      <Flex flexDirection="column" pb="16px">
        <Balance fontSize="20px" bold value={cakeAsNumberBalance} decimals={5} />
        <Text fontSize="12px" color="textSubtle" display="flex">
          {cakePriceBusd.gt(0) ? (
            <Balance value={stakedDollarValue} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
          ) : (
            <Skeleton mt="1px" height={16} width={64} />
          )}
          {!isLoading && totalSharesPercentage && (
            <Box as="span" ml="2px">
              | {t('%num% of total', { num: `${totalSharesPercentage.toString()}%` })}
            </Box>
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
        {accountHasSharesStaked && pool.vaultKey === VaultKey.IfoPool && <IfoVaultCardAvgBalance pool={pool} />}
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
