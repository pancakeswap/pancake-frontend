import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useZombie } from 'hooks/useContract'

import Web3 from 'web3'
import GraveApprovalAction from './GraveApprovalAction'
import GraveStakeActions from './GraveStakeActions'
import tokens from '../../../../../config/constants/tokens'
import { GraveConfig } from '../../../../../config/constants/types'
import useLastUpdated from '../../../../../hooks/useLastUpdated'
import { getAddress, getRestorationChefAddress } from '../../../../../utils/addressHelpers'
import { BIG_ZERO } from '../../../../../utils/bigNumber'
import GraveUnlockingAction from './GraveUnlockingAction'
import { getBep20Contract, getContract } from '../../../../../utils/contractHelpers'
import GraveDepositRugAction from './GraveDepositRugAction'
import GraveRuggedTokenApprovalAction from './GraveRuggedTokenApprovalAction'
import IsStakedActions from './IsStakedActions'
import GraveWithdrawAction from './GraveWithdrawAction'

const InlineText = styled(Text)`
  display: inline;
`
let zombie
let ruggedToken
let unlockingToken
let lastZombieAllowanceQuery = 0
let lastRuggedTokenAllowanceQuery = 0
let lastUnlockingTokenAllowanceQuery = 0
const tenSeconds = 10000

async function getZombieAllowance(account, setState) {
  zombie.methods.allowance(account, getRestorationChefAddress()).call()
    .then(amount => {
      lastZombieAllowanceQuery = Date.now()
      const allowance = new BigNumber(amount)
      setState(allowance)
    })
    .catch(() => {
      console.log('Failed to get zombie allowance')
    })
}

async function getTokenAllowance(account, tokenSymbol, setState, resetTimer) {
  ruggedToken.methods.allowance(account, getRestorationChefAddress()).call()
    .then(amount => {
      resetTimer()
      const allowance = new BigNumber(amount)
      setState(allowance)
    })
    .catch(() => {
      console.log(`Failed to get ${tokenSymbol} allowance`)
    })
}

const GraveCardActions: React.FC<{
  accountHasSharesStaked: boolean
  account: string
  zombiePrice: BigNumber
  ruggedTokenPrice: BigNumber
  unlockingFee: number
  grave: GraveConfig
  balances: any
  userData: any
  stakingTokenBalance: number
  isLoading: boolean
  web3: Web3
}> = ({
        accountHasSharesStaked,
        account,
        zombiePrice,
        ruggedTokenPrice,
        unlockingFee,
        balances,
        grave,
        userData,
        stakingTokenBalance,
        isLoading,
        web3,
      }) => {
  const [zombieAllowance, setZombieAllowance] = useState(BIG_ZERO)
  const [ruggedTokenAllowance, setRuggedTokenAllowance] = useState(BIG_ZERO)
  const [unlockingTokenAllowance, setUnlockingTokenAllowance] = useState(BIG_ZERO)
  zombie = useZombie()
  ruggedToken = getBep20Contract(getAddress(grave.ruggedToken.address), web3)
  unlockingToken = getBep20Contract(getAddress(grave.unlockingToken.address), web3)
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  if (!zombieAllowance.gt(0) && (Date.now() - lastZombieAllowanceQuery) >= tenSeconds) {
    getZombieAllowance(account, setZombieAllowance)
  }
  if (!ruggedTokenAllowance.gt(0) && (Date.now() - lastRuggedTokenAllowanceQuery) >= tenSeconds) {
    getTokenAllowance(
      account,
      grave.ruggedToken.symbol,
      setRuggedTokenAllowance,
      () => { lastRuggedTokenAllowanceQuery = Date.now() }
    )
  }
  if (!unlockingTokenAllowance.gt(0) && (Date.now() - lastUnlockingTokenAllowanceQuery) >= tenSeconds) {
    getTokenAllowance(
      account,
      grave.unlockingToken.symbol,
      setUnlockingTokenAllowance,
      () => { lastUnlockingTokenAllowanceQuery = Date.now() }
    )
  }
  const { t } = useTranslation()

  const zombieStakingMax = new BigNumber(balances.zombie)
  const ruggedTokenStakingMax = new BigNumber(balances.ruggedToken)

  let currentAction
  if (!ruggedTokenAllowance.gt(0)) { // if rug is not approved
    currentAction =
      <GraveApprovalAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} token={grave.ruggedToken} web3={web3} />

  } else if (!(userData.rugDeposited > 0)) { // if rug is not deposited
    currentAction =
      <GraveDepositRugAction grave={grave} userData={userData} ruggedTokenPrice={ruggedTokenPrice} stakingMax={ruggedTokenStakingMax} balances={balances} account={account}
                             setLastUpdated={setLastUpdated} web3={web3} />

  } else if (!unlockingTokenAllowance.gt(0)) { // if unlocking token is not approved
    currentAction =
      <GraveApprovalAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} token={grave.unlockingToken} web3={web3} />

  } else if (!userData.paidUnlockingFee) { // if grave has not been unlocked
    currentAction =
      <GraveUnlockingAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated}
                            web3={web3} />

  } else if(!zombieAllowance.gt(0)) { // if zombie is not approved
    currentAction =
      <GraveApprovalAction grave={grave} account={account} isLoading={isLoading} setLastUpdated={setLastUpdated} token={tokens.zmbe} web3={web3} />

  } else if (!(userData.zombieStaked > 0)) { // if zombie is not staked
    currentAction = <GraveStakeActions
      grave={grave}
      userData={userData}
      zombiePrice={zombiePrice} // todo fix
      balances={balances}
      stakingMax={zombieStakingMax}
      account={account}
      isLoading={isLoading}
      setLastUpdated={setLastUpdated}
      web3={web3}
    />
  } else { // when zombie is staked
    currentAction = <GraveWithdrawAction
      grave={grave}
      userData={userData}
      stakingMax={balances.zombie}
      zombiePrice={zombiePrice}
      stakingTokenBalance={balances.zombie}
      account={account}
      web3={web3}
    />
  }
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
        {currentAction}
      </Flex>
    </Flex>
  )
}

export default GraveCardActions
