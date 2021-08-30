import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ModalContainer,
  ModalBody,
  ModalTitle,
  ModalHeader,
  InjectedModalProps,
  Button,
  AutoRenewIcon,
  TrophyGoldIcon,
  Text,
  Flex,
  Heading,
  Box,
  ModalCloseButton,
  Skeleton,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { usePriceBnbBusd } from 'state/farms/hooks'
import { REWARD_RATE } from 'state/predictions/config'
import { fetchNodeHistory, markAsCollected } from 'state/predictions'
import { Bet } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { usePredictionsContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGetHistoryByAccount, useGetIsFetchingHistory } from 'state/predictions/hooks'
import { getPayout } from './History/helpers'

interface CollectRoundWinningsModalProps extends InjectedModalProps {
  onSuccess?: () => Promise<void>
}

const Modal = styled(ModalContainer)`
  overflow: visible;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

interface ClaimableRounds {
  epochs: number[]
  total: number
}

const calculateClaimableRounds = (history): ClaimableRounds => {
  if (!history) {
    return { epochs: [], total: 0 }
  }

  return history.reduce(
    (accum: ClaimableRounds, bet: Bet) => {
      if (!bet.claimed && bet.position === bet.round.position) {
        const betPayout = getPayout(bet, REWARD_RATE)
        return {
          ...accum,
          epochs: [...accum.epochs, bet.round.epoch],
          total: accum.total + betPayout,
        }
      }

      return accum
    },
    { epochs: [], total: 0 },
  )
}

const CollectRoundWinningsModal: React.FC<CollectRoundWinningsModalProps> = ({ onDismiss, onSuccess }) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const predictionsContract = usePredictionsContract()
  const bnbBusdPrice = usePriceBnbBusd()
  const dispatch = useAppDispatch()
  const isLoadingHistory = useGetIsFetchingHistory()
  const history = useGetHistoryByAccount(account)

  const { epochs, total } = calculateClaimableRounds(history)

  useEffect(() => {
    // Fetch history if they have not opened the history pane yet
    if (history.length === 0) {
      dispatch(fetchNodeHistory(account))
    }
  }, [account, history, dispatch])

  const handleClick = async () => {
    try {
      const tx = await callWithGasPrice(predictionsContract, 'claim', [epochs])
      setIsPendingTx(true)
      const receipt = await tx.wait()

      // Immediately mark rounds as claimed
      dispatch(
        markAsCollected(
          epochs.reduce((accum, epoch) => {
            return { ...accum, [epoch]: true }
          }, {}),
        ),
      )

      if (onSuccess) {
        await onSuccess()
      }

      onDismiss()
      setIsPendingTx(false)
      toastSuccess(
        t('Winnings collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your prizes have been sent to your wallet')}
        </ToastDescriptionWithTx>,
      )
    } catch (error) {
      console.error('Unable to claim winnings', error)
      toastError(
        t('Error'),
        error?.data?.message || t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      )
    } finally {
      setIsPendingTx(false)
    }
  }

  return (
    <Modal minWidth="288px" position="relative" mt="124px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <ModalBody p="24px">
        <TrophyGoldIcon width="96px" mx="auto" mb="24px" />
        <Flex alignItems="start" justifyContent="space-between" mb="8px">
          <Text>{t('Collecting')}</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text>{`${total.toFixed(4)} BNB`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${bnbBusdPrice.times(total).toFormat(2)}`}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="start" justifyContent="center" mb="24px">
          {isLoadingHistory ? (
            <Skeleton height="21" width="140px" />
          ) : (
            <Text color="textSubtle" fontSize="14px">
              {epochs.length === 1
                ? t('From round %round%', { round: epochs[0] })
                : t('From rounds %rounds%', { rounds: epochs.join(', ') })}
            </Text>
          )}
        </Flex>
        <Button
          width="100%"
          mb="8px"
          onClick={handleClick}
          isLoading={isPendingTx || isLoadingHistory}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {t('Confirm')}
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default CollectRoundWinningsModal
