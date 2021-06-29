import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, AutoRenewIcon, Won } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { LotteryTicketClaimData } from 'config/constants/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { callWithEstimateGas } from 'utils/callHelpers'
import { useLottery, usePriceCakeBusd } from 'state/hooks'
import { fetchUserLotteries } from 'state/lottery'
import { useAppDispatch } from 'state'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useLotteryV2Contract } from 'hooks/useContract'
import { parseClaimDataForClaimTicketsCall } from '../helpers'

interface ClaimInnerProps {
  roundsToClaim: LotteryTicketClaimData[]
  onSuccess?: () => void
}

const ClaimInnerContainer: React.FC<ClaimInnerProps> = ({ onSuccess, roundsToClaim }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { maxNumberTicketsPerBuyOrClaim } = useLottery()
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

  const shouldBatchRequest = claimTicketsCallData.ticketIds.length > maxNumberTicketsPerBuyOrClaim.toNumber()

  // const totalNumClaims = roundsToClaim.slice(activeClaimIndex).reduce((accum, _round) => {
  //   return accum + Math.ceil(_round.ticketsWithRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber())
  // }, 0)

  const totalNumClaimsForRound = () =>
    Math.ceil(roundsToClaim[activeClaimIndex].ticketsWithRewards.length / maxNumberTicketsPerBuyOrClaim.toNumber())

  const handleProgressToNextClaim = () => {
    if (roundsToClaim.length > activeClaimIndex + 1) {
      // If there are still rounds to claim, move onto the next claim
      setActiveClaimIndex(activeClaimIndex + 1)
    } else {
      onSuccess()
    }
  }

  const getTicketBatches = (ticketIds: string[], brackets: number[]): { ticketIds: string[]; brackets: number[] }[] => {
    const requests = []
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
    setPendingTx(true)
    try {
      const tx = await callWithEstimateGas(lotteryContract, 'claimTickets', [lotteryId, ticketIds, brackets])
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Prizes Collected!'), t(`Your CAKE prizes for round ${lotteryId} have been sent to your wallet`))
        setPendingTx(false)
        dispatch(fetchUserLotteries({ account }))
        handleProgressToNextClaim()
      }
    } catch (error) {
      console.error(error)
      toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
      setPendingTx(false)
    }
  }

  const handleBatchClaim = async () => {
    const { lotteryId, ticketIds, brackets } = claimTicketsCallData
    const ticketBatches = getTicketBatches(ticketIds, brackets)
    const transactionsToFire = ticketBatches.length
    const receipts = []
    setPendingTx(true)
    // eslint-disable-next-line no-restricted-syntax
    for (const ticketBatch of ticketBatches) {
      try {
        /* eslint-disable no-await-in-loop */
        const tx = await callWithEstimateGas(lotteryContract, 'claimTickets', [
          lotteryId,
          ticketBatch.ticketIds,
          ticketBatch.brackets,
        ])
        const receipt = await tx.wait()
        /* eslint-enable no-await-in-loop */
        if (receipt.status) {
          // One transaction within batch has succeeded
          receipts.push(receipt)

          // More transactions are to be done within the batch. Issue toast to give user feedback.
          if (receipts.length !== transactionsToFire) {
            toastSuccess(
              t('Prizes Collected!'),
              t(
                `Claim %claimNum% of %claimTotal% for round %lotteryId% was successful. Please confirm the next transation`,
                {
                  claimNum: receipts.length,
                  claimTotal: transactionsToFire,
                  lotteryId,
                },
              ),
            )
          }
        }
      } catch (error) {
        console.error(error)
        toastError(t('Error'), t('%error% - Please try again.', { error: error.message }))
      }
    }

    // Batch is finished
    if (receipts.length === transactionsToFire) {
      setPendingTx(false)
      toastSuccess(
        t('Prizes Collected!'),
        t(`Your CAKE prizes for round %lotteryId& have been sent to your wallet`, { lotteryId }),
      )
      dispatch(fetchUserLotteries({ account }))
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
          justifyContent={['flex-start', null, 'center']}
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
          <Won ml={['0', null, '12px']} width="64px" />
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
          {t('Round')} #{round}
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
          {pendingTx ? t('Claiming') : t('Claim')} {totalNumClaimsForRound() > 1 ? `(${totalNumClaimsForRound()})` : ''}
        </Button>
      </Flex>
    </>
  )
}

export default ClaimInnerContainer
