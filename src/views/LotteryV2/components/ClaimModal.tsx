import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Modal, Flex, Button, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { LotteryTicketClaimData } from 'config/constants/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useLotteryV2Contract } from 'hooks/useContract'
import { parseClaimDataForClaimTicketsCall } from '../helpers'

const StyledModal = styled(Modal)`
  min-width: 280px;
  /* max-width: 320px; */

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

interface ViewTicketsModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimModal: React.FC<ViewTicketsModalProps> = ({ onDismiss, roundsToClaim }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { toastSuccess, toastError } = useToast()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)
  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const lotteryContract = useLotteryV2Contract()
  const cakePriceBusd = new BigNumber(20)
  const cakeReward = roundsToClaim[activeClaimIndex].cakeTotal
  const dollarReward = cakeReward.times(cakePriceBusd)
  const rewardAsBalance = getBalanceAmount(cakeReward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()
  const round = roundsToClaim[activeClaimIndex].roundId
  const claimTicketsCallData = parseClaimDataForClaimTicketsCall(roundsToClaim[activeClaimIndex])

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
    } else if (roundsToClaim.length === 1) {
      // If there was only one round to claim, don't show additional 'No more rewards to claim!' toast
      onDismiss()
    } else {
      onDismiss()
      toastSuccess(t('No more rewards to claim!'))
    }
  }

  const handleClaim = () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    lotteryContract.methods
      .claimTickets(lotteryId, ticketIds, brackets)
      .send({ from: account })
      .on('sending', () => {
        setPendingTx(true)
      })
      .on('receipt', () => {
        toastSuccess(t('Claimed!'), t(`You have claimed rewards for round ${lotteryId}`))
        setPendingTx(false)
        handleProgressToNextClaim()
      })
      .on('error', (error) => {
        console.error(error)
        toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
        setPendingTx(false)
      })
  }

  return (
    <StyledModal
      title={`${t('Collect winnings')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex flexDirection="column">
        <Text mb="4px">{t('You won')}</Text>
        <Balance lineHeight="1.1" value={rewardAsBalance} fontSize="44px" bold color="secondary" unit=" CAKE!" />
        <Balance value={dollarRewardAsBalance} fontSize="12px" color="textSubtle" unit=" USD" prefix="~" />
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {t('Round')} #{round}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => handleClaim()}
        >
          {pendingTx ? t('Claiming') : t('Claim')}
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default ClaimModal
