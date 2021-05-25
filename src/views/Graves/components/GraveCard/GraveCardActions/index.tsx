import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake, useCakeVaultContract, useZombie } from 'hooks/useContract'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Graves/types'
import GraveApprovalAction from './GraveApprovalAction'
import GraveStakeActions from './GraveStakeActions'
import tokens from '../../../../../config/constants/tokens'
import { GraveConfig } from '../../../../../config/constants/types'
import useLastUpdated from '../../../../../hooks/useLastUpdated'
import { getRestorationChefAddress } from '../../../../../utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from '../../../../../utils/bigNumber'

const InlineText = styled(Text)`
  display: inline;
`
let zombie

async function getAllowance(account, setState) {
  zombie.methods.allowance(account, getRestorationChefAddress()).call()
    .then((amount) => {
      // allowance = new BigNumber(amount)
      setState(true)
    })
    .catch(() => {
      console.log('Failed to get zombie allowance')
    })
}

const GraveCardActions: React.FC<{
  accountHasSharesStaked: boolean
  account: string
  zombiePrice: BigNumber
  unlockingFee: number
  grave: GraveConfig
  balances: any
  userData: number
  stakingTokenBalance: number
  isLoading: boolean
}> = ({
        accountHasSharesStaked,
        account,
        zombiePrice,
        unlockingFee,
        balances,
        grave,
        userData,
        stakingTokenBalance,
        isLoading,
      }) => {
  const [isVaultApproved, setIsVaultApproved] = useState(false)
  const [_, setAllowance] = useState("0")
  const cakeContract = useCake()
  zombie = useZombie()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  getAllowance(account, setAllowance)
  const { t } = useTranslation()

  const stakingMax = new BigNumber(30000) // todo get users balance of zmbe


  // useEffect(() => {
  //   const checkApprovalStatus = async () => {
  //     try {
  //       const response = await cakeContract.methods.allowance(account, getRestorationChefAddress()).call()
  //       const currentAllowance = response
  //       allowance = currentAllowance
  //       setIsVaultApproved(currentAllowance.gt(0))
  //     } catch (error) {
  //       setIsVaultApproved(false)
  //     }
  //   }

  //   checkApprovalStatus()
  // }, [account, cakeContract, cakeVaultContract, lastUpdated])

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
        {true ? (
          <GraveStakeActions
            grave={grave}
            userData={userData}
            zombiePrice={zombiePrice} // todo fix
            balances={balances}
            stakingMax={stakingMax}
            account={account}
            isLoading={isLoading}
            setLastUpdated={setLastUpdated}
          />
        ) : (
          <GraveApprovalAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} />
        )}
      </Flex>
    </Flex>
  )
}

export default GraveCardActions
