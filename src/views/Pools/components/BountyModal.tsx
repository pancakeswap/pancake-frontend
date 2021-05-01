import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from '@pancakeswap-libs/uikit'
import { useCakeVaultContract } from 'hooks/useContract'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'

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
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getFullDisplayBalance(totalPendingCakeRewards, 18, 3)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom',
    tooltipPadding: { right: 15 },
  })

  const handleConfirmClick = async () => {
    cakeVaultContract.methods
      .harvest()
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
        setPendingTx(false)
        onDismiss()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(
          t('Could not be collected'),
          t(`There may be an issue with your transaction, or another user claimed the bounty first.`),
        )
        setPendingTx(false)
      })
  }

  return (
    <Modal title={t('Claim Bounty')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      {tooltipVisible && tooltip}
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{t("You'll claim")}</Text>
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
          {t('Pool total pending yield')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {totalYieldToDisplay} CAKE
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {t('Bounty')}
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
        {t('Confirm')}
      </Button>
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {t("What's this?")}
        </Text>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
    </Modal>
  )
}

export default BountyModal
