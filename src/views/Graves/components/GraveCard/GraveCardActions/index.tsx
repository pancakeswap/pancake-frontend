import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract } from 'hooks/useContract'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Graves/types'
import VaultApprovalAction from './VaultApprovalAction'
import GraveStakeActions from './GraveStakeActions'
import tokens from '../../../../../config/constants/tokens'
import { GraveConfig } from '../../../../../config/constants/types'
import useLastUpdated from '../../../../../hooks/useLastUpdated'

const InlineText = styled(Text)`
  display: inline;
`

const GraveCardActions: React.FC<{
  accountHasSharesStaked: boolean
  account: string
  zombiePrice: BigNumber
  unlockingFee: number
  grave: GraveConfig
  userData: number
  stakingTokenBalance: number
  isLoading: boolean
}> = ({
        accountHasSharesStaked,
        account,
        zombiePrice,
        unlockingFee,
        grave,
        userData,
        stakingTokenBalance,
        isLoading,
      }) => {
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const cakeContract = useCake()
  const cakeVaultContract = useCakeVaultContract()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  const { t } = useTranslation()

  const stakingMax = new BigNumber(30000) // todo get users balance of zmbe


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
    <Flex flexDirection='column'>
      <Flex flexDirection='column'>
        <Box display='inline'>
          <InlineText
            color={accountHasSharesStaked ? 'secondary' : 'textSubtle'}
            textTransform='uppercase'
            bold
            fontSize='12px'
          >
            {accountHasSharesStaked ? tokens.zmbe.symbol : t(`stake`)}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform='uppercase'
            bold
            fontSize='12px'
          >
            {accountHasSharesStaked ? t(`staked (compounding)`) : `${tokens.zmbe.symbol}`}

          </InlineText>
        </Box>
        {isVaultApproved ? (
          <GraveStakeActions
            grave={grave}
            userData={userData}
            zombiePrice={zombiePrice} // todo fix
            stakingMax={stakingMax}
            account={account}
            isLoading={isLoading}
            setLastUpdated={setLastUpdated}
          />
        ) : (
          <VaultApprovalAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default GraveCardActions
