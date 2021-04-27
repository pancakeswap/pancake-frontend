import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useLastUpdated from 'hooks/useLastUpdated'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import { Pool } from 'state/types'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  userShares: number
  pricePerFullShare: BigNumber
  lastDepositedTime: number
  stakingTokenPrice: number
  accountHasSharesStaked: boolean
  account: string
}> = ({
  pool,
  userShares,
  pricePerFullShare,
  lastDepositedTime,
  stakingTokenPrice,
  accountHasSharesStaked,
  account,
}) => {
  const { stakingToken, earningToken, userData } = pool
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const { lastUpdated, setLastUpdated } = useLastUpdated()
  const cakeContract = useCake()
  const cakeVaultContract = useCakeVaultContract()
  const TranslateString = useI18n()
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  // const earnings = new BigNumber(userData?.pendingReward || 0)

  const isLoading = !userData || !userShares

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const response = await cakeContract.methods.allowance(account, cakeVaultContract.options.address).call()
        const currentAllowance = new BigNumber(response)
        setIsVaultApproved(currentAllowance.gt(0))
      } catch (error) {
        setIsVaultApproved(false)
      }
    }

    checkApprovalStatus()
  }, [account, cakeContract, cakeVaultContract, lastUpdated])

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
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenPrice={stakingTokenPrice}
            userShares={userShares}
            lastDepositedTime={lastDepositedTime}
            accountHasSharesStaked={accountHasSharesStaked}
            account={account}
          />
        ) : (
          <VaultApprovalAction pool={pool} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
