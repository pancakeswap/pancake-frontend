import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Balance, Button, Flex, PresentWonIcon, Text, useToast } from '@pancakeswap/uikit'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { useCakePrice } from 'hooks/useCakePrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useLotteryV2Contract } from 'hooks/useContract'
import { useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchUserLotteries } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'
import { useGasPrice } from 'state/user/hooks'
import { callWithEstimateGas } from 'utils/calls'
import { TransactionReceipt } from 'viem'
import { useAccount } from 'wagmi'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<React.PropsWithChildren<ClaimInnerProps>> = ({ onSuccess, roundsToClaim }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { maxNumberTicketsPerBuyOrClaim, currentLotteryId } = useLottery()
  const gasPrice = useGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const [activeClaimIndex, setActiveClaimIndex] = useState(0)
  const [pendingBatchClaims, setPendingBatchClaims] = useState(
    Math.ceil(
      roundsToClaim[activeClaimIndex].ticketsWithUnclaimedRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber(),
    ),
  )
  const lotteryContract = useLotteryV2Contract()
  const activeClaimData = roundsToClaim[activeClaimIndex]

  const cakePrice = useCakePrice()
  const cakeReward = activeClaimData.cakeTotal
  const dollarReward = cakeReward.times(cakePrice)
  const rewardAsBalance = getBalanceAmount(cakeReward).toNumber()
  const dollarRewardAsBalance = getBalanceAmount(dollarReward).toNumber()

  const parseUnclaimedTicketDataForClaimCall = (ticketsWithUnclaimedRewards: LotteryTicket[], lotteryId: string) => {
    const ticketIds = ticketsWithUnclaimedRewards.map((ticket) => {
      return ticket.id
    })
    const brackets = ticketsWithUnclaimedRewards.map((ticket) => {
      return ticket.rewardBracket
    })
    return { lotteryId, ticketIds, brackets }
  }

  const claimTicketsCallData = parseUnclaimedTicketDataForClaimCall(
    activeClaimData.ticketsWithUnclaimedRewards,
    activeClaimData.roundId,
  )

  const shouldBatchRequest = maxNumberTicketsPerBuyOrClaim.lt(claimTicketsCallData.ticketIds.length)

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
      if (account) dispatch(fetchUserLotteries({ account, currentLotteryId }))
    } else {
      onSuccess?.()
    }
  }

  type Ticket = {
    ticketIds: string[]
    brackets: Array<number | undefined>
  }
  const getTicketBatches = (ticketIds: string[], brackets: Array<number | undefined>): Ticket[] => {
    const requests: Ticket[] = []
    const maxAsNumber = maxNumberTicketsPerBuyOrClaim.toNumber()

    for (let i = 0; i < ticketIds.length; i += maxAsNumber) {
      const ticketIdsSlice = ticketIds.slice(i, maxAsNumber + i)
      const bracketsSlice = brackets.slice(i, maxAsNumber + i)
      requests.push({ ticketIds: ticketIdsSlice, brackets: bracketsSlice })
    }

    return requests
  }

  const handleClaim = async () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    const receipt = await fetchWithCatchTxError(() => {
      return callWithEstimateGas(
        lotteryContract,
        'claimTickets',
        [BigInt(lotteryId), ticketIds.map(BigInt), brackets.map(Number)],
        {
          gasPrice,
        },
      )
    })
    if (receipt?.status) {
      toastSuccess(
        t('Prizes Collected!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your CAKE prizes for round %lotteryId% have been sent to your wallet', { lotteryId })}
        </ToastDescriptionWithTx>,
      )
      handleProgressToNextClaim()
    }
  }

  const handleBatchClaim = async () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    const ticketBatches = getTicketBatches(ticketIds, brackets)
    const transactionsToFire = ticketBatches.length
    const receipts: TransactionReceipt[] = []
    // eslint-disable-next-line no-restricted-syntax
    for (const ticketBatch of ticketBatches) {
      /* eslint-disable no-await-in-loop */
      const receipt = await fetchWithCatchTxError(() => {
        return callWithEstimateGas(
          lotteryContract,
          'claimTickets',
          [BigInt(lotteryId), ticketBatch.ticketIds.map(BigInt), ticketBatch.brackets.map(Number)],
          { gasPrice },
        )
      })
      if (receipt?.status) {
        // One transaction within batch has succeeded
        receipts.push(receipt)
        setPendingBatchClaims(transactionsToFire - receipts.length)

        // More transactions are to be done within the batch. Issue toast to give user feedback.
        if (receipts.length !== transactionsToFire) {
          toastSuccess(
            t('Prizes Collected!'),
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t(
                'Claim %claimNum% of %claimTotal% for round %lotteryId% was successful. Please confirm the next transaction',
                {
                  claimNum: receipts.length,
                  claimTotal: transactionsToFire,
                  lotteryId,
                },
              )}
            </ToastDescriptionWithTx>,
          )
        }
      } else {
        break
      }
    }

    // Batch is finished
    if (receipts.length === transactionsToFire) {
      toastSuccess(
        t('Prizes Collected!'),
        t('Your CAKE prizes for round %lotteryId% have been sent to your wallet', { lotteryId }),
      )
      handleProgressToNextClaim()
    }
  }

  return (
    <>
      <Flex flexDirection="column">
        <Text mb="4px" textAlign={['center', null, 'left']}>
          {t('You won')}
        </Text>
        <Flex
          alignItems={['flex-start', null, 'center']}
          justifyContent={['flex-start', null, 'space-between']}
          flexDirection={['column', null, 'row']}
        >
          <Balance
            textAlign={['center', null, 'left']}
            lineHeight="1.1"
            value={rewardAsBalance}
            fontSize="44px"
            bold
            color="secondary"
            unit=" CAKE!"
          />
          <PresentWonIcon ml={['0', null, '12px']} width="64px" />
        </Flex>
        <Balance
          mt={['12px', null, '0']}
          textAlign={['center', null, 'left']}
          value={dollarRewardAsBalance}
          fontSize="12px"
          color="textSubtle"
          unit=" USD"
          prefix="~"
        />
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        <Text mt="8px" fontSize="12px" color="textSubtle">
          {t('Round')} #{activeClaimData.roundId}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          mt="20px"
          width="100%"
          onClick={() => (shouldBatchRequest ? handleBatchClaim() : handleClaim())}
        >
          {pendingTx ? t('Claiming') : t('Claim')} {pendingBatchClaims > 1 ? `(${pendingBatchClaims})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
