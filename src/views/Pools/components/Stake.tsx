import React, { useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Button, Box, Flex, Text, useModal, IconButton, AddIcon, MinusIcon } from '@pancakeswap-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { useERC20 } from 'hooks/useContract'
import useHasCakeBalance from 'hooks/useHasCakeBalance'
import { useSousApprove } from 'hooks/useApprove'
import { usePriceCakeBusd, useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

import TokenRequiredModal from './TokenRequiredModal'
import StakeModal from './StakeModal'
import ConfirmButton from './ConfirmButton'

interface StakeProps {
  pool: Pool
  isOldSyrup: boolean
  isBnbPool: boolean
}

const Stake: React.FC<StakeProps> = ({ pool, isOldSyrup, isBnbPool }) => {
  const { userData, isFinished, stakingToken, sousId, stakingLimit, earningToken } = pool

  const TranslateString = useI18n()
  const cakePrice = usePriceCakeBusd()
  const hasCake = useHasCakeBalance(new BigNumber(0))
  const { account } = useWeb3React()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const stakedBalanceBusd = new BigNumber(getBalanceNumber(stakedBalance)).multipliedBy(cakePrice).toNumber()
  const [requestedApproval, setRequestedApproval] = useState(false)

  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const { toastSuccess, toastError } = useToast()

  const [onPresentTokenRequired] = useModal(<TokenRequiredModal token={stakingToken} />)
  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      sousId={sousId}
      stakingTokenDecimals={stakingToken.decimals}
      stakingTokenName={stakingToken.symbol}
      stakingTokenAddress={stakingToken.address}
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      sousId={sousId}
      stakingTokenDecimals={stakingToken.decimals}
      stakingTokenName={stakingToken.symbol}
      stakingTokenAddress={stakingToken.address}
      isStaking={false}
      max={stakedBalance}
    />,
  )

  const handleStakeClick = () => {
    if (hasCake) {
      onPresentStake()
      return
    }

    onPresentTokenRequired()
  }

  const handleRenderEnableButtonText = () => {
    if (requestedApproval) {
      return TranslateString(999, 'Enabling')
    }

    return TranslateString(999, 'Enable')
  }

  const handleRenderLabel = (): JSX.Element => {
    if (isFinished && sousId !== 0) {
      return (
        <>
          <Text color="secondary" fontSize="12px" bold>
            {stakingToken.symbol}
          </Text>
          &nbsp;
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {TranslateString(1074, 'Staked')}
          </Text>
        </>
      )
    }

    if (!account) {
      return (
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(999, 'Start Earning')}
        </Text>
      )
    }

    if (accountHasStakedBalance) {
      return (
        <>
          <Text color="secondary" fontSize="12px" bold>
            {stakingToken.symbol}
          </Text>
          &nbsp;
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {TranslateString(1074, 'Staked')}
          </Text>
        </>
      )
    }

    return (
      <>
        <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
          {TranslateString(316, 'Stake')}
        </Text>
        &nbsp;
        <Text color="secondary" fontSize="12px" bold>
          {stakingToken.symbol}
        </Text>
      </>
    )
  }

  const handleRenderActions = (): JSX.Element => {
    if (!account) {
      return <UnlockButton width="100%" />
    }

    if (isFinished && sousId !== 0) {
      return (
        <Flex>
          <Box>
            <Balance
              value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
              isDisabled={!stakedBalance.toNumber() || isFinished}
              fontSize="20px"
            />
            <Balance
              value={stakedBalanceBusd}
              isDisabled={!stakedBalanceBusd}
              fontSize="12px"
              prefix="~"
              bold={false}
              unit=" USD"
            />
          </Box>
          <Flex alignItems="center" ml="auto">
            <Button disabled={!stakedBalance.toNumber()} minWidth="116px" onClick={onPresentUnstake}>
              {TranslateString(588, 'Unstake')}
            </Button>
          </Flex>
        </Flex>
      )
    }

    if (needsApproval && !isOldSyrup) {
      return (
        <ConfirmButton
          disabled={isFinished || requestedApproval}
          onClick={handleApprove}
          width="100%"
          minWidth="116px"
          isLoading={requestedApproval}
        >
          {handleRenderEnableButtonText()}
        </ConfirmButton>
      )
    }

    if (accountHasStakedBalance) {
      return (
        <Flex>
          <Box>
            <Balance
              value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
              isDisabled={!stakedBalance.toNumber() || isFinished}
              fontSize="20px"
            />
            <Balance
              value={stakedBalanceBusd}
              isDisabled={!stakedBalanceBusd}
              fontSize="12px"
              prefix="~"
              bold={false}
              unit=" USD"
            />
          </Box>
          <Flex alignItems="center" ml="auto">
            <IconButton variant="secondary" onClick={onPresentUnstake} mr="8px">
              <MinusIcon color="primary" width="14px" />
            </IconButton>
            <IconButton variant="secondary" onClick={onPresentStake}>
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </Flex>
        </Flex>
      )
    }

    return (
      <Button width="100%" onClick={handleStakeClick} minWidth="116px">
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

        toastError(
          TranslateString(999, 'Canceled'),
          TranslateString(999, 'Please try again and confirm the transaction.'),
        )
        return
      }

      toastSuccess(
        `${TranslateString(999, 'Contract Enabled')}`,
        TranslateString(999, 'You can now stake in the pool!'),
      )
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }, [onApprove, setRequestedApproval, toastSuccess, toastError, TranslateString])

  return (
    <Flex flexDirection="column" mt="16px">
      <Flex mb="4px">{handleRenderLabel()}</Flex>
      {handleRenderActions()}
    </Flex>
  )
}

export default Stake
