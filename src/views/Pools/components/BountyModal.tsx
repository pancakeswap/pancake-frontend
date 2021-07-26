import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, HelpIcon, AutoRenewIcon, useTooltip } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Balance from 'components/Balance'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { useCakeVault } from 'state/pools/hooks'

interface BountyModalProps {
  onDismiss?: () => void
  TooltipComponent: React.ElementType
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 16px auto;
  width: 100%;
`

const BountyModal: React.FC<BountyModalProps> = ({ onDismiss, TooltipComponent }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [pendingTx, setPendingTx] = useState(false)
  const {
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: { callFee },
  } = useCakeVault()
  const cakePriceBusd = usePriceCakeBusd()
  const callFeeAsDecimal = callFee / 100
  const totalYieldToDisplay = getBalanceNumber(totalPendingCakeHarvest, 18)

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyReward).multipliedBy(cakePriceBusd)
  }, [cakePriceBusd, estimatedCakeBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedCakeBounty = estimatedCakeBountyReward ? estimatedCakeBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const cakeBountyToDisplay = hasFetchedCakeBounty ? getBalanceNumber(estimatedCakeBountyReward, 18) : 0

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom',
    tooltipPadding: { right: 15 },
  })

  const handleConfirmClick = async () => {
    setPendingTx(true)
    try {
      const tx = await cakeVaultContract.harvest({ gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
        setPendingTx(false)
        onDismiss()
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setPendingTx(false)
    }
  }

  return (
    <Modal title={t('Claim Bounty')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      {tooltipVisible && tooltip}
      <Flex alignItems="flex-start" justifyContent="space-between">
        <Text>{t('You’ll claim')}</Text>
        <Flex flexDirection="column">
          <Balance bold value={cakeBountyToDisplay} decimals={7} unit=" CAKE" />
          <Text fontSize="12px" color="textSubtle">
            <Balance
              fontSize="12px"
              color="textSubtle"
              value={dollarBountyToDisplay}
              decimals={2}
              unit=" USD"
              prefix="~"
            />
          </Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" color="textSubtle">
          {t('Pool total pending yield')}
        </Text>
        <Balance color="textSubtle" value={totalYieldToDisplay} unit=" CAKE" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text fontSize="14px" color="textSubtle">
          {t('Bounty')}
        </Text>
        <Text fontSize="14px" color="textSubtle">
          {callFeeAsDecimal}%
        </Text>
      </Flex>
      {account ? (
        <Button
          isLoading={pendingTx}
          disabled={!dollarBountyToDisplay || !cakeBountyToDisplay || !callFee}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
          mb="28px"
          id="autoCakeConfirmBounty"
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      ) : (
        <ConnectWalletButton mb="28px" />
      )}
      <Flex justifyContent="center" alignItems="center">
        <Text fontSize="16px" bold color="textSubtle" mr="4px">
          {t('What’s this?')}
        </Text>
        <span ref={targetRef}>
          <HelpIcon color="textSubtle" />
        </span>
      </Flex>
    </Modal>
  )
}

export default BountyModal
