import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import { Pool } from 'state/types'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { getAddress } from 'utils/addressHelpers'

interface StakeProps {
  pool: Pool
  tokenName: string
  isOldSyrup: boolean
  isBnbPool: boolean
}

const Stake: React.FC<StakeProps> = ({ pool, tokenName, isOldSyrup, isBnbPool }) => {
  const { userData, isFinished, stakingToken, sousId } = pool

  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const stakingTokenContract = useERC20(getAddress(stakingToken.address))
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool

  const [requestedApproval, setRequestedApproval] = useState(false)

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
          {tokenName}
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
          {TranslateString(564, 'Approve')}
        </Button>
      )
    }

    return <Button width="100%">{TranslateString(316, 'Stake')}</Button>
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
