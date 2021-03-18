import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex, Text, useModal } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { Pool } from 'state/types'
import { useERC20 } from 'hooks/useContract'
import useHasCakeBalance from 'hooks/useHasCakeBalance'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'

import CakeRequiredModal from './CakeRequiredModal'
import StakeModal from './StakeModal'

interface StakeProps {
  pool: Pool
  stakingTokenDecimals?: number
  isOldSyrup: boolean
  isBnbPool: boolean
}

const Stake: React.FC<StakeProps> = ({ pool, isOldSyrup, isBnbPool }) => {
  const { userData, isFinished, stakingTokenAddress, sousId, stakingTokenDecimals, stakingTokenName } = pool

  const TranslateString = useI18n()
  const hasCake = useHasCakeBalance(new BigNumber(0))
  const { account } = useWeb3React()
  const stakingTokenContract = useERC20(stakingTokenAddress)
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const [onPresentCakeRequired] = useModal(<CakeRequiredModal />)
  const [onPresentStake] = useModal(
    <StakeModal isBnbPool={isBnbPool} sousId={sousId} stakingTokenDecimals={stakingTokenDecimals} />,
  )

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  const [requestedApproval, setRequestedApproval] = useState(false)

  const handleStakeClick = () => {
    if (hasCake) {
      onPresentStake()
      return
    }

    onPresentCakeRequired()
  }

  const handleRenderLabel = (): JSX.Element => {
    if (!account) {
      return (
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(999, 'Start Earning')}
        </Text>
      )
    }
    return (
      <>
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(316, 'Stake')}
        </Text>
        &nbsp;
        <Text color="textSecondary" fontSize="12px" bold>
          {stakingTokenName}
        </Text>
      </>
    )
  }

  const handleRenderActions = (): JSX.Element => {
    if (!account) {
      return <UnlockButton width="100%" />
    }

    if (needsApproval && !isOldSyrup) {
      return (
        <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
          {TranslateString(999, 'Enable')}
        </Button>
      )
    }

    return (
      <Button width="100%" onClick={handleStakeClick}>
        {TranslateString(316, 'Stake')}
      </Button>
    )
  }

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Flex flexDirection="column" mt="16px">
      <Flex mb="4px">{handleRenderLabel()}</Flex>
      {handleRenderActions()}
    </Flex>
  )
}

export default Stake
