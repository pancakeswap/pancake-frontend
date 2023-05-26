import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { LotteryResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { bigIntToSerializedBigNumber } from '@pancakeswap/utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { ContractFunctionResult } from 'viem'

const lotteryContract = getLotteryV2Contract()

const processViewLotterySuccessResponse = (
  response: ContractFunctionResult<typeof lotteryV2ABI, 'viewLottery'>,
  lotteryId: string,
): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicketInCake,
    discountDivisor,
    treasuryFee,
    firstTicketId,
    amountCollectedInCake,
    finalNumber,
    cakePerBracket,
    countWinnersPerBracket,
    rewardsBreakdown,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedCakePerBracket = cakePerBracket.map((cakeInBracket) => bigIntToSerializedBigNumber(cakeInBracket))
  const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
    bigIntToSerializedBigNumber(winnersInBracket),
  )
  const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => bigIntToSerializedBigNumber(reward))

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicketInCake: bigIntToSerializedBigNumber(priceTicketInCake),
    discountDivisor: discountDivisor?.toString(),
    treasuryFee: treasuryFee?.toString(),
    firstTicketId: firstTicketId?.toString(),
    amountCollectedInCake: bigIntToSerializedBigNumber(amountCollectedInCake),
    finalNumber,
    cakePerBracket: serializedCakePerBracket,
    countWinnersPerBracket: serializedCountWinnersPerBracket,
    rewardsBreakdown: serializedRewardsBreakdown,
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInCake: '',
    discountDivisor: '',
    treasuryFee: '',
    firstTicketId: '',
    amountCollectedInCake: '',
    finalNumber: null,
    cakePerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
  }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.read.viewLottery([BigInt(lotteryId)])
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map(
    (id) =>
      ({
        abi: lotteryV2ABI,
        functionName: 'viewLottery',
        address: getLotteryV2Address(),
        args: [BigInt(id)],
      } as const),
  )
  try {
    const client = publicClient({ chainId: ChainId.BSC })
    const multicallRes = await client.multicall({
      contracts: calls,
    })
    const processedResponses = multicallRes.map((res, index) =>
      processViewLotterySuccessResponse(res.result, lotteryIds[index]),
    )
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryId = async (): Promise<bigint> => {
  return lotteryContract.read.currentLotteryId()
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const calls = (['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'] as const).map(
      (method) =>
        ({
          abi: lotteryV2ABI,
          address: getLotteryV2Address(),
          functionName: method,
        } as const),
    )

    const client = publicClient({ chainId: ChainId.BSC })
    const [currentLotteryId, maxNumberTicketsPerBuyOrClaim] = await client.multicall({
      contracts: calls,
      allowFailure: false,
    })

    return {
      currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
      maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim ? maxNumberTicketsPerBuyOrClaim.toString() : null,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuyOrClaim: null,
    }
  }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    if (currentIdAsInt - i > 0) {
      roundIds.push(currentIdAsInt - i)
    }
  }
  return roundIds.map((roundId) => roundId?.toString())
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}
