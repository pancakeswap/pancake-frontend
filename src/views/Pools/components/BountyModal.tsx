import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'

interface BountyModalProps {
  cakeCallBountyToDisplay: string
  dollarCallBountyToDisplay: string
  totalPendingCakeRewards: BigNumber
  callFee: number
  onDismiss?: () => void
  TooltipComponent: React.ElementType
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const BountyModal: React.FC<BountyModalProps> = ({
  cakeCallBountyToDisplay,
  dollarCallBountyToDisplay,
  totalPendingCakeRewards,
  callFee,
  onDismiss,
  TooltipComponent,
}) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getFullDisplayBalance(totalPendingCakeRewards, 18, 3)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, 'bottom-end')

  const handleConfirmClick = async () => {
    cakeVaultContract.methods
      .harvest()
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(
          TranslateString(999, 'Bounty collected!'),
          TranslateString(999, 'CAKE bounty has been sent to your wallet.'),
        )
        setPendingTx(false)
        onDismiss()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          TranslateString(999, 'Could not be collected'),
          TranslateString(
            999,
            `There may be an issue with your transaction, or another user claimed the bounty first.`,
          ),
        )
        setPendingTx(false)
      })
  }

  return (
    <Modal
      title={TranslateString(999, 'Claim Bounty')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      {tooltipVisible && tooltip}
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{TranslateString(999, "You'll claim")}</Text>
        <Flex flexDirection="column">
          <Text bold>{cakeCallBountyToDisplay} CAKE</Text>
          <Text fontSize="12px" color="textSubtle">
            ~ {dollarCallBountyToDisplay} USD
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Pool total pending yield')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {totalYieldToDisplay} CAKE
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {TranslateString(999, 'Bounty')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {callFeeAsDecimal}%
        </Text>
      </Flex>
      <Button
        isLoading={pendingTx}
        endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        onClick={handleConfirmClick}
        mb="28px"
      >
        {TranslateString(464, 'Confirm')}
      </Button>
      <Flex ref={targetRef} justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {TranslateString(999, "What's this?")}
        </Text>
        <HelpIcon color="textSubtle" />
      </Flex>
    </Modal>
  )
}

export default BountyModal
