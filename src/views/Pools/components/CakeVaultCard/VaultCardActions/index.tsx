import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCheckVaultApprovalStatus } from 'hooks/useApprove'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  accountHasSharesStaked: boolean
  isLoading: boolean
}> = ({ pool, accountHasSharesStaked, isLoading }) => {
  const { stakingToken, userData } = pool
  const { t, currentLanguage } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Box display="inline">
          <InlineText color={accountHasSharesStaked ? 'secondary' : 'textSubtle'} bold fontSize="12px">
            {accountHasSharesStaked
              ? stakingToken.symbol.toUpperCase()
              : t('Stake').toLocaleUpperCase(currentLanguage.locale)}{' '}
          </InlineText>
          <InlineText color={accountHasSharesStaked ? 'textSubtle' : 'secondary'} bold fontSize="12px">
            {accountHasSharesStaked
              ? t('Staked (compounding)').toLocaleUpperCase(currentLanguage.locale)
              : `${stakingToken.symbol.toUpperCase()}`}
          </InlineText>
        </Box>
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={accountHasSharesStaked}
          />
        ) : (
          <VaultApprovalAction isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
