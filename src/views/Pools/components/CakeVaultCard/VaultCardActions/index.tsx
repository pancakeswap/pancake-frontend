import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'

import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool, VaultKey } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { FlexGap } from 'components/Layout/Flex'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

export const IfoVaultCardAvgBalance = () => {
  const { t } = useTranslation()

  return (
    <>
      <FlexGap gap="4px" alignItems="center">
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {t('IFO Credit')}
        </InlineText>
      </FlexGap>
      <Flex flexDirection="column" pb="16px">
        <Balance fontSize="20px" bold value={0} decimals={5} />
        <Text fontSize="12px" color="textSubtle" display="flex">
          <Balance value={0} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
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
        {accountHasSharesStaked && (
          <>
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
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
