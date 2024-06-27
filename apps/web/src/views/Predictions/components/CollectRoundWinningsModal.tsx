import { useTranslation } from '@pancakeswap/localization'
import { REWARD_RATE } from '@pancakeswap/prediction'
import { Token } from '@pancakeswap/sdk'
import {
  AutoRenewIcon,
  Box,
  Button,
  Flex,
  Heading,
  InjectedModalProps,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Skeleton,
  Text,
  TrophyGoldIcon,
  useToast,
} from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { AnyAction, AsyncThunkAction } from '@reduxjs/toolkit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePredictionsContract } from 'hooks/useContract'
import { useEffect } from 'react'
import { fetchNodeHistory, markAsCollected } from 'state/predictions'
import { Bet } from 'state/types'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { useTokenUsdPriceBigNumber } from 'views/Predictions/hooks/useTokenPrice'
import { useAccount } from 'wagmi'
import { getPayout } from './History/helpers'

interface CollectRoundWinningsModalProps extends InjectedModalProps {
  onSuccess?: () => Promise<void>
  dispatch: (action: AnyAction | AsyncThunkAction<any, { account: string }, any>) => void
  history: Bet[]
  isLoadingHistory: boolean
  predictionsAddress: Address
  token: Token | undefined
  isV1Claim?: boolean
  isNativeToken: boolean
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
      if (!bet.claimed && bet.position === bet?.round?.position) {
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

const CollectRoundWinningsModal: React.FC<React.PropsWithChildren<CollectRoundWinningsModalProps>> = ({
  onDismiss,
  onSuccess,
  history,
  isLoadingHistory,
  dispatch,
  predictionsAddress,
  token,
  isV1Claim,
  isNativeToken,
}) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const predictionsContract = usePredictionsContract(predictionsAddress, isNativeToken)
  const tokenPrice = useTokenUsdPriceBigNumber(token)

  const { epochs, total } = calculateClaimableRounds(history)
  const totalToken = tokenPrice.multipliedBy(total).toNumber()

  const isLoading = isLoadingHistory || !epochs?.length

  useEffect(() => {
    // Fetch history if they have not opened the history pane yet
    if (history.length === 0 && !isV1Claim && account && chainId) {
      dispatch(fetchNodeHistory({ account, chainId }))
    }
  }, [account, history, dispatch, isV1Claim, chainId])

  const handleClick = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(predictionsContract as any, 'claim', [epochs])
    })
    if (receipt?.status) {
      if (!isV1Claim) {
        // Immediately mark rounds as claimed
        dispatch(
          markAsCollected(
            epochs.reduce((accum, epoch) => {
              return { ...accum, [epoch]: true }
            }, {}),
          ),
        )
      }

      await onSuccess?.()

      toastSuccess(
        t('Winnings collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your prizes have been sent to your wallet')}
        </ToastDescriptionWithTx>,
      )
      onDismiss?.()
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
            <Text>{`${formatNumber(total, 0, 6)} ${token?.symbol}`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${totalToken.toFixed(2)}`}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="start" justifyContent="center" mb="24px">
          {isLoading ? (
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
          isLoading={isPendingTx || isLoading}
          endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
        >
          {t('Confirm')}
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default CollectRoundWinningsModal
