import React from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Box, Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo } from 'config/constants/types'
import { UserInfo, WalletIfoState } from '../../hooks/useGetWalletIfoData'

interface ClaimProps {
  ifo: Ifo
  contract: Contract
  userInfo: UserInfo
  isPendingTx: WalletIfoState['isPendingTx']
  setPendingTx: (status: boolean) => void
  offeringTokenBalance: WalletIfoState['offeringTokenBalance']
  setIsClaimed: () => void
}

const AmountGrid = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 24px;
`

const DISPLAY_DECIMALS = 4

const Claim: React.FC<ClaimProps> = ({
  ifo,
  contract,
  userInfo,
  isPendingTx,
  setPendingTx,
  offeringTokenBalance,
  setIsClaimed,
}) => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const didContribute = userInfo.amount.gt(0)
  const canClaim = !userInfo.claimed && offeringTokenBalance.gt(0)
  const contributedBalance = getBalanceNumber(userInfo.amount)
  const { tokenSymbol, tokenDecimals } = ifo
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
          <Text fontSize="20px" bold color={offeringTokenBalance.gt(0) ? 'text' : 'textDisabled'}>
            {contributedBalance.toFixed(userInfo.amount.eq(0) ? 0 : DISPLAY_DECIMALS)}
          </Text>
        </Box>
        <Box>
          <Flex mb="4px">
            <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
              {tokenSymbol}
            </Text>
            <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
              To Claim
            </Text>
          </Flex>
          <Text fontSize="20px" bold color={offeringTokenBalance.gt(0) ? 'text' : 'textDisabled'}>
            {getBalanceNumber(offeringTokenBalance, tokenDecimals).toFixed(
              offeringTokenBalance.eq(0) ? 0 : DISPLAY_DECIMALS,
            )}
          </Text>
        </Box>
      </AmountGrid>
      {didContribute ? (
        <Button
          onClick={handleClaim}
          disabled={isPendingTx || !canClaim}
          fullWidth
          mb="24px"
          isLoading={isPendingTx}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {canClaim ? TranslateString(999, 'Claim') : TranslateString(999, 'Claimed')}
        </Button>
      ) : (
        <Button disabled fullWidth mb="24px">
          {TranslateString(999, 'Nothing to Claim')}
        </Button>
      )}
      <Text mt="4px">{TranslateString(999, "You'll be refunded any excess tokens when you claim")}</Text>
    </>
  )
}

export default Claim
