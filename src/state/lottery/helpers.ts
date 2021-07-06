import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import { ethers } from 'ethers'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import {
  LotteryUserGraphEntity,
  LotteryRoundGraphEntity,
  LotteryRound,
  UserTicketsResponse,
  UserRound,
  LotteryRoundUserTickets,
  LotteryResponse,
} from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { useMemo } from 'react'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'

const lotteryContract = getLotteryV2Contract()

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.viewLottery(lotteryId)
    const {
      status,
      startTime,
      endTime,
      priceTicketInCake,
      discountDivisor,
      treasuryFee,
      firstTicketId,
      lastTicketId,
      amountCollectedInCake,
      finalNumber,
      cakePerBracket,
      countWinnersPerBracket,
      rewardsBreakdown,
    } = lotteryData

    const statusKey = Object.keys(LotteryStatus)[status]
    const serializedCakePerBracket = cakePerBracket.map((cakeInBracket) => ethersToSerializedBigNumber(cakeInBracket))
    const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
      ethersToSerializedBigNumber(winnersInBracket),
    )
    const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => ethersToSerializedBigNumber(reward))

    return {
      isLoading: false,
      status: LotteryStatus[statusKey],
      startTime: startTime?.toString(),
      endTime: endTime?.toString(),
      priceTicketInCake: ethersToSerializedBigNumber(priceTicketInCake),
      discountDivisor: discountDivisor?.toString(),
      treasuryFee: treasuryFee?.toString(),
      firstTicketId: firstTicketId?.toString(),
      lastTicketId: lastTicketId?.toString(),
      amountCollectedInCake: ethersToSerializedBigNumber(amountCollectedInCake),
      finalNumber,
      cakePerBracket: serializedCakePerBracket,
      countWinnersPerBracket: serializedCountWinnersPerBracket,
      rewardsBreakdown: serializedRewardsBreakdown,
    }
  } catch (error) {
    return {
      isLoading: true,
      status: LotteryStatus.PENDING,
      startTime: '',
      endTime: '',
      priceTicketInCake: '',
      discountDivisor: '',
      treasuryFee: '',
      firstTicketId: '',
      lastTicketId: '',
      amountCollectedInCake: '',
      finalNumber: null,
      cakePerBracket: [],
      countWinnersPerBracket: [],
      rewardsBreakdown: [],
    }
  }
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const calls = ['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'].map((method) => ({
      address: getLotteryV2Address(),
      name: method,
    }))
    const [[currentLotteryId], [maxNumberTicketsPerBuyOrClaim]] = (await multicallv2(
      lotteryV2Abi,
      calls,
    )) as ethers.BigNumber[][]

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

export const processRawTicketsResponse = (ticketsResponse: UserTicketsResponse): LotteryTicket[] => {
  const [ticketIds, ticketNumbers, ticketStatuses] = ticketsResponse

  if (ticketIds?.length > 0) {
    return ticketIds.map((ticketId, index) => {
      return {
        id: ticketId.toString(),
        number: ticketNumbers[index].toString(),
        status: ticketStatuses[index],
      }
    })
  }
  return []
}

export const getViewUserTicketInfoCalls = (totalTicketsToRequest: number, account: string, lotteryId: string) => {
  let cursor = 0
  const perRequestLimit = 1000
  const calls = []

  for (let i = 0; i < totalTicketsToRequest; i += perRequestLimit) {
    cursor = i
    calls.push({
      name: 'viewUserInfoForLotteryId',
      address: getLotteryV2Address(),
      params: [account, lotteryId, cursor, perRequestLimit],
    })
  }
  return calls
}

export const mergeViewUserTicketInfoMulticallResponse = (response) => {
  const mergedMulticallResponse: UserTicketsResponse = [[], [], []]

  response.forEach((ticketResponse) => {
    mergedMulticallResponse[0].push(...ticketResponse[0])
    mergedMulticallResponse[1].push(...ticketResponse[1])
    mergedMulticallResponse[2].push(...ticketResponse[2])
  })

  return mergedMulticallResponse
}

export const fetchTickets = async (
  account: string,
  lotteryId: string,
  userRoundData?: UserRound,
): Promise<LotteryTicket[]> => {
  // If the subgraph is returning user totalTickets data for the round - use those totalTickets, if not - batch request up to 5000
  const totalTicketsToRequest = userRoundData ? parseInt(userRoundData?.totalTickets, 10) : 5000
  const calls = getViewUserTicketInfoCalls(totalTicketsToRequest, account, lotteryId)
  try {
    const multicallRes = await multicallv2(lotteryV2Abi, calls, { requireSuccess: false })
    // When using a static totalTicketsToRequest value - null responses may be returned
    const filteredForNullResponses = multicallRes.filter((res) => res)
    const mergedMulticallResponse = mergeViewUserTicketInfoMulticallResponse(filteredForNullResponses)
    const completeTicketData = processRawTicketsResponse(mergedMulticallResponse)
    return completeTicketData
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getGraphLotteries = async (): Promise<LotteryRoundGraphEntity[]> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getLotteries {
        lotteries(first: 100, orderDirection: desc, orderBy: block) {
          id
          totalUsers
          totalTickets
          status
          finalNumber
          winningTickets
          startTime
          endTime
          ticketPrice
          firstTicket
          lastTicket
        }
      }
    `,
  )

  const { lotteries } = response
  return lotteries
}

export const getGraphLotteryUser = async (account: string): Promise<LotteryUserGraphEntity> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getUserLotteryData($account: ID!) {
        user(id: $account) {
          id
          totalTickets
          totalCake
          rounds(first: 100, orderDirection: desc, orderBy: block) {
            id
            lottery {
              id
              endTime
              status
            }
            claimed
            totalTickets
          }
        }
      }
    `,
    { account: account.toLowerCase() },
  )
  const { user } = response

  // If no subgraph response - return blank user
  if (!response || !user) {
    const blankUser = {
      account,
      totalCake: '',
      totalTickets: '',
      rounds: [],
    }

    return blankUser
  }

  const formattedUser = user && {
    account: user.id,
    totalCake: user.totalCake,
    totalTickets: user.totalTickets,
    rounds: user.rounds.map((round) => {
      return {
        lotteryId: round?.lottery?.id,
        endTime: round?.lottery?.endTime,
        claimed: round?.claimed,
        totalTickets: round?.totalTickets,
        status: round?.lottery?.status,
      }
    }),
  }

  return formattedUser
}

export const useProcessLotteryResponse = (
  lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
  const {
    priceTicketInCake: priceTicketInCakeAsString,
    discountDivisor: discountDivisorAsString,
    amountCollectedInCake: amountCollectedInCakeAsString,
  } = lotteryData

  const discountDivisor = useMemo(() => {
    return new BigNumber(discountDivisorAsString)
  }, [discountDivisorAsString])

  const priceTicketInCake = useMemo(() => {
    return new BigNumber(priceTicketInCakeAsString)
  }, [priceTicketInCakeAsString])

  const amountCollectedInCake = useMemo(() => {
    return new BigNumber(amountCollectedInCakeAsString)
  }, [amountCollectedInCakeAsString])

  return {
    isLoading: lotteryData.isLoading,
    userTickets: lotteryData.userTickets,
    status: lotteryData.status,
    startTime: lotteryData.startTime,
    endTime: lotteryData.endTime,
    priceTicketInCake,
    discountDivisor,
    treasuryFee: lotteryData.treasuryFee,
    firstTicketId: lotteryData.firstTicketId,
    lastTicketId: lotteryData.lastTicketId,
    amountCollectedInCake,
    finalNumber: lotteryData.finalNumber,
    cakePerBracket: lotteryData.cakePerBracket,
    countWinnersPerBracket: lotteryData.countWinnersPerBracket,
    rewardsBreakdown: lotteryData.rewardsBreakdown,
  }
}
