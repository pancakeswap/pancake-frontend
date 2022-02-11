import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Skeleton } from '@tovaswapui/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool, VaultKey } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { useIfoPoolCredit } from 'state/pools/hooks'
import QuestionHelper from 'components/QuestionHelper'
import { FlexGap } from 'components/Layout/Flex'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

export const IfoVaultCardAvgBalance = () => {
  const { t } = useTranslation()
  const credit = useIfoPoolCredit()

  const cakeAsNumberBalance = getBalanceNumber(credit)
  const creditsDollarValue: number | undefined = useBUSDCakeAmount(cakeAsNumberBalance)

  return (
    <>
      <FlexGap gap="4px" alignItems="center">
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {t('IFO Credit')}
        </InlineText>
        <QuestionHelper
          size="24px"
          placement="auto"
          display="inline"
          text={
            <>
              <Text>
                {t(
                  'Your entry limit in the next IFO sale is determined by your IFO credit. This is calculated by the average CAKE balance of the principal amount in the IFO pool during the last credit calculation period.',
                )}
              </Text>
              <Text>
                {t(
                  'Please note: even the pool is auto compounding. Amount of profits will not be included during IFO credit calculations.',
                )}
              </Text>
            </>
          }
        />
      </FlexGap>
      <Flex flexDirection="column" pb="16px">
        <Balance fontSize="20px" bold value={cakeAsNumberBalance} decimals={5} />
        <Text fontSize="12px" color="textSubtle" display="flex">
          {creditsDollarValue !== undefined ? (
            <Balance
              value={creditsDollarValue}
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              prefix="~"
              unit=" USD"
            />
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
        {isVaultApproved && pool.vaultKey === VaultKey.IfoPool && <IfoVaultCardAvgBalance />}
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
