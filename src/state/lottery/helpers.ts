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
// Variable used to determine how many past rounds should be populated by node data rather than subgraph
export const NUM_ROUNDS_TO_FETCH_FROM_NODES = 8

const processViewLotterySuccessResponse = (response): LotteryResponse => {
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
  } = response

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
}

const processViewLotteryErrorResponse = () => {
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

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.viewLottery(lotteryId)
    return processViewLotterySuccessResponse(lotteryData)
  } catch (error) {
    return processViewLotteryErrorResponse()
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map((id) => ({
    name: 'viewLottery',
    address: getLotteryV2Address(),
    params: [id],
  }))
  try {
    const multicallRes = await multicallv2(lotteryV2Abi, calls, { requireSuccess: false })
    const processedResponses = multicallRes.map((res) => processViewLotterySuccessResponse(res[0]))
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map(() => processViewLotteryErrorResponse())
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
  userTotalTickets?: string,
): Promise<LotteryTicket[]> => {
  // If the subgraph is returning user totalTickets data for the round - use those totalTickets, if not - batch request up to 5000
  const totalTicketsToRequest = userTotalTickets ? parseInt(userTotalTickets, 10) : 5000
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

const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    roundIds.push(currentIdAsInt - i)
  }
  return roundIds
}

const applyNodeDataToLotteriesGraphResponse = (
  nodeData: LotteryResponse[],
  graphRespose: LotteryRoundGraphEntity[],
): LotteryRoundGraphEntity[] => {
  const mergedResponse = graphRespose.map((graphRound, index) => {
    const nodeRound = nodeData[index]
    if (nodeRound) {
      // if isLoading === true, there has been an error - return graphRound
      if (!nodeRound.isLoading) {
        return {
          endTime: nodeRound.endTime,
          finalNumber: nodeRound.finalNumber.toString(),
          startTime: nodeRound.startTime,
          status: nodeRound.status,
          id: graphRound.id,
          ticketPrice: graphRound.ticketPrice,
          totalTickets: graphRound.totalTickets,
          totalUsers: graphRound.totalTickets,
          winningTickets: graphRound.totalTickets,
        }
      }
      return graphRound
    }
    return graphRound
  })
  return mergedResponse
}

export const getLotteriesData = async (currentLotteryId: string): Promise<LotteryRoundGraphEntity[]> => {
  const idsForNodesCall = getRoundIdsArray(currentLotteryId)
  const nodeData = await fetchMultipleLotteries(idsForNodesCall)
  const graphResponse = await getGraphLotteries()
  const mergedData = applyNodeDataToLotteriesGraphResponse(nodeData, graphResponse)
  return mergedData
}

const getGraphLotteries = async (): Promise<LotteryRoundGraphEntity[]> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getLotteries {
        lotteries(first: 100, orderDirection: desc, orderBy: block) {
          id
          totalUsers
          totalTickets
          winningTickets
          status
          finalNumber
          startTime
          endTime
          ticketPrice
        }
      }
    `,
  )

  const { lotteries } = response
  return lotteries
}

export const getUserLotteryData = async (
  account: string,
  currentLotteryId: string,
): Promise<LotteryUserGraphEntity> => {
  const idsForNodeCall = getRoundIdsArray(currentLotteryId)
  // Find out if user has any tickets in any of these lotteries
  // See if they have claimed any of those tickets
  // Get status of that lottery from node

  const graphResponse = await getGraphLotteryUser(account)

  // graphResponse.rounds {
  // claimed: null
  // status: "Open"
  // endTime: "1625767200"
  // lotteryId: "12"
  // totalTickets: "10"
  // }

  debugger // eslint-disable-line

  return graphResponse
}

const getGraphLotteryUser = async (account: string): Promise<LotteryUserGraphEntity> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getUserLotteries($account: ID!) {
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
