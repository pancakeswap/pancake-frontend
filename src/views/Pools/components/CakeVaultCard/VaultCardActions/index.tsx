import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import ApprovalAction from '../../PoolCard/CardActions/ApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  userShares: number
  pricePerFullShare: BigNumber
  stakingTokenPrice: number
  accountHasSharesStaked: boolean
}> = ({ pool, userShares, pricePerFullShare, stakingTokenPrice, accountHasSharesStaked }) => {
  const { stakingToken, earningToken, userData } = pool
  const TranslateString = useI18n()
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  // const earnings = new BigNumber(userData?.pendingReward || 0)

  // Is there an approval call on the contract? Should we use the existing sousPool approval with the cake pool id?
  const needsApproval = false
  const isLoading = !userShares && !userData

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
            {accountHasSharesStaked ? stakingToken.symbol : TranslateString(1070, `stake`)}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? TranslateString(1074, `staked`) : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenPrice={stakingTokenPrice}
            userShares={userShares}
            accountHasSharesStaked={accountHasSharesStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
