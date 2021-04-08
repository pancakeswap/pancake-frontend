import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Box, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { UserPoolCharacteristics } from 'hooks/ifo/v2/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo } from 'config/constants/types'
import BalanceInUsd from './BalanceInUsd'
import MetaLabel from './MetaLabel'

interface ClaimProps {
  ifo: Ifo
  contract: Contract
  userPoolCharacteristics: UserPoolCharacteristics
  setPendingTx: (status: boolean) => void
  setIsClaimed: () => void
}

const AmountGrid = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 24px;
`

const DISPLAY_DECIMALS = 4

const Claim: React.FC<ClaimProps> = ({ ifo, contract, userPoolCharacteristics, setPendingTx, setIsClaimed }) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { amountTokenCommittedInLP, refundingAmountInLP, offeringAmountInToken, isPendingTx } = userPoolCharacteristics
  const didContribute = amountTokenCommittedInLP.isGreaterThan(0)
  const canClaim = !userPoolCharacteristics.hasClaimed
  const contributedBalance = getBalanceNumber(amountTokenCommittedInLP)
  const refundedBalance = getBalanceNumber(refundingAmountInLP).toFixed(
    amountTokenCommittedInLP.eq(0) ? 0 : DISPLAY_DECIMALS,
  )
  const { token } = ifo
  const rewardBalance = getBalanceNumber(offeringAmountInToken, token.decimals)
  const { toastError, toastSuccess } = useToast()

  const handleClaim = async () => {
    try {
      setPendingTx(true)
      await contract.methods.harvest().send({ from: account })
      setIsClaimed()
      toastSuccess('Success!', 'You have successfully claimed your rewards.')
    } catch (error) {
      toastError('Error', error?.message)
      console.error(error)
    } finally {
      setPendingTx(false)
    }
  }

  return (
    <>
      <AmountGrid>
        <Box>
          <Flex mb="4px">
            <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
              LP Tokens
            </Text>
            <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
              Committed
            </Text>
          </Flex>
          <Text fontSize="20px" bold color={offeringAmountInToken.gt(0) ? 'text' : 'textDisabled'}>
            {contributedBalance.toFixed(amountTokenCommittedInLP.eq(0) ? 0 : DISPLAY_DECIMALS)}
          </Text>
          <MetaLabel>
            {canClaim
              ? TranslateString(999, `${refundedBalance} to reclaim`, { num: refundedBalance })
              : TranslateString(999, `${refundedBalance} reclaimed`, { num: refundedBalance })}
          </MetaLabel>
        </Box>
        <Box>
          <Flex mb="4px">
            <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
              {token.symbol}
            </Text>
            {!canClaim ? (
              <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
                Claimed
              </Text>
            ) : (
              <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
                To Claim
              </Text>
            )}
          </Flex>
          <Text fontSize="20px" bold color={offeringAmountInToken.gt(0) ? 'text' : 'textDisabled'}>
            {rewardBalance.toFixed(offeringAmountInToken.eq(0) ? 0 : DISPLAY_DECIMALS)}
          </Text>
          {canClaim && <BalanceInUsd token={token.symbol} balance={rewardBalance} />}
        </Box>
      </AmountGrid>
      {didContribute ? (
        <Button
          onClick={handleClaim}
          disabled={isPendingTx || !canClaim}
          width="100%"
          mb="24px"
          isLoading={isPendingTx}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {canClaim ? TranslateString(999, 'Claim') : TranslateString(999, 'Claimed')}
        </Button>
      ) : (
        <Button disabled width="100%" mb="24px">
          {TranslateString(999, 'Nothing to Claim')}
        </Button>
      )}
      <Text mt="4px">{TranslateString(999, "You'll be refunded any excess tokens when you claim")}</Text>
    </>
  )
}

export default Claim
