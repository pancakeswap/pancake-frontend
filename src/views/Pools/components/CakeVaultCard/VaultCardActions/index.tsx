import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  accountHasSharesStaked: boolean
  isLoading: boolean
  performanceFee: number
}> = ({ pool, accountHasSharesStaked, isLoading, performanceFee }) => {
  const { stakingToken, userData } = pool
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
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
          <VaultApprovalAction isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
