import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryTicket } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryResponse, UserRound } from 'state/types'
import { getRoundIdsArray, fetchMultipleLotteries, hasRoundBeenClaimed } from './helpers'
import { fetchUserTicketsForMultipleRounds } from './getUserTicketsData'

const applyNodeDataToUserGraphResponse = (
  userNodeData: { roundId: string; userTickets: LotteryTicket[] }[],
  userGraphData: UserRound[],
  lotteryNodeData: LotteryResponse[],
): UserRound[] => {
  //   If no graph rounds response - return node data
  if (userGraphData.length === 0) {
    return lotteryNodeData.map((nodeRound) => {
      const ticketDataForRound = userNodeData.find((roundTickets) => roundTickets.roundId === nodeRound.lotteryId)
      return {
        endTime: nodeRound.endTime,
        status: nodeRound.status,
        lotteryId: nodeRound.lotteryId.toString(),
        claimed: hasRoundBeenClaimed(ticketDataForRound.userTickets),
        totalTickets: `${ticketDataForRound.userTickets.length.toString()}`,
        tickets: ticketDataForRound.userTickets,
      }
    })
  }

  //   Else if there is a graph response - merge with node data where node data is more accurate
  const mergedResponse = userGraphData.map((graphRound, index) => {
    const nodeRound = lotteryNodeData[index]
    // if there is node data for this index, overwrite graph data. Otherwise - return graph data.
    if (nodeRound) {
      const ticketDataForRound = userNodeData.find((roundTickets) => roundTickets.roundId === nodeRound.lotteryId)
      // if isLoading === true, there has been a node error - return graphRound
      if (!nodeRound.isLoading) {
        return {
          endTime: nodeRound.endTime,
          status: nodeRound.status,
          lotteryId: nodeRound.lotteryId.toString(),
          claimed: hasRoundBeenClaimed(ticketDataForRound.userTickets),
          totalTickets: graphRound.totalTickets,
          tickets: ticketDataForRound.userTickets,
        }
      }
      return graphRound
    }
    return graphRound
  })
  return mergedResponse
}

const getGraphLotteryUser = async (account: string): Promise<LotteryUserGraphEntity> => {
  let user
  const blankUser = {
    account,
    totalCake: '',
    totalTickets: '',
    rounds: [],
  }

  try {
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
    const userRes = response.user

    // If no user returned - return blank user
    if (!userRes) {
      user = blankUser
    } else {
      user = {
        account: userRes.id,
        totalCake: userRes.totalCake,
        totalTickets: userRes.totalTickets,
        rounds: userRes.rounds.map((round) => {
          return {
            lotteryId: round?.lottery?.id,
            endTime: round?.lottery?.endTime,
            claimed: round?.claimed,
            totalTickets: round?.totalTickets,
            status: round?.lottery?.status,
          }
        }),
      }
    }
  } catch (error) {
    console.error(error)
    user = blankUser
  }

  return user
}

const getUserLotteryData = async (account: string, currentLotteryId: string): Promise<LotteryUserGraphEntity> => {
  const idsForTicketsNodeCall = getRoundIdsArray(currentLotteryId)
  const roundDataAndUserTickets = await fetchUserTicketsForMultipleRounds(idsForTicketsNodeCall, account)
  const userRoundsNodeData = roundDataAndUserTickets.filter((round) => round.userTickets.length > 0)
  const idsForLotteriesNodeCall = userRoundsNodeData.map((round) => round.roundId)

  const lotteriesNodeData = await fetchMultipleLotteries(idsForLotteriesNodeCall)
  const graphResponse = await getGraphLotteryUser(account)
  const mergedRoundData = applyNodeDataToUserGraphResponse(userRoundsNodeData, graphResponse.rounds, lotteriesNodeData)
  const graphResponseWithNodeRounds = { ...graphResponse, rounds: mergedRoundData }
  return graphResponseWithNodeRounds
}

export default getUserLotteryData
