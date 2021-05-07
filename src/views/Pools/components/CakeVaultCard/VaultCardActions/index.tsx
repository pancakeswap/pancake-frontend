import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import { BIG_ZERO } from 'utils/bigNumber'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Pools/types'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const CakeVaultCardActions: React.FC<{
  pool: Pool
  userInfo: VaultUser
  pricePerFullShare: BigNumber
  stakingTokenPrice: number
  accountHasSharesStaked: boolean
  lastUpdated: number
  vaultFees: VaultFees
  isLoading: boolean
  setLastUpdated: () => void
}> = ({
  pool,
  userInfo,
  pricePerFullShare,
  stakingTokenPrice,
  accountHasSharesStaked,
  lastUpdated,
  vaultFees,
  isLoading,
  setLastUpdated,
}) => {
  const { account } = useWeb3React()
  const { stakingToken, userData } = pool
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const cakeContract = useCake()
  const cakeVaultContract = useCakeVaultContract()
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

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
            {accountHasSharesStaked ? stakingToken.symbol : t(`stake`)}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? t(`staked (compounding)`) : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {isVaultApproved ? (
          <VaultStakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenPrice={stakingTokenPrice}
            vaultFees={vaultFees}
            userInfo={userInfo}
            pricePerFullShare={pricePerFullShare}
            accountHasSharesStaked={accountHasSharesStaked}
            setLastUpdated={setLastUpdated}
          />
        ) : (
          <VaultApprovalAction pool={pool} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default CakeVaultCardActions
