import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryUserGraphEntity, LotteryResponse, UserRound } from 'state/types'
import {
  getRoundIdsArray,
  fetchMultipleLotteries,
  NUM_ROUNDS_TO_FETCH_FROM_NODES,
  processRawTicketsResponse,
} from './helpers'
import { fetchUserTicketsForMultipleRounds } from './fetchUnclaimedUserRewards'

const applyNodeDataToUserGraphResponse = (nodeData: LotteryResponse[], graphData: UserRound[]) => {
  //   debugger // eslint-disable-line
  // const mergedResponse = graphRespose.map((graphRound, index) => {
  //   const nodeRound = nodeData[index]
  //   if (nodeRound) {
  //     // if isLoading === true, there has been an error - return graphRound
  //     if (!nodeRound.isLoading) {
  //       return {
  //         endTime: nodeRound.endTime,
  //         finalNumber: nodeRound.finalNumber.toString(),
  //         startTime: nodeRound.startTime,
  //         status: nodeRound.status,
  //         id: graphRound.id,
  //         ticketPrice: graphRound.ticketPrice,
  //         totalTickets: graphRound.totalTickets,
  //         totalUsers: graphRound.totalTickets,
  //         winningTickets: graphRound.totalTickets,
  //       }
  //     }
  //     return graphRound
  //   }
  //   return graphRound
  // })
  return ''
}

const getUserLotteryData = async (account: string, currentLotteryId: string): Promise<LotteryUserGraphEntity> => {
  const idsForTicketsNodeCall = getRoundIdsArray(currentLotteryId)
  const ticketsToRequestPerRound = '5000'
  const blindRoundData = idsForTicketsNodeCall.map((roundId) => {
    return {
      totalTickets: ticketsToRequestPerRound,
      lotteryId: roundId,
    }
  })
  const rawUserTicketNodeData = await fetchUserTicketsForMultipleRounds(blindRoundData, account)
  const roundDataAndUserTickets = rawUserTicketNodeData.map((rawRoundTicketData, index) => {
    return {
      roundId: idsForTicketsNodeCall[index],
      userTickets: processRawTicketsResponse(rawRoundTicketData),
    }
  })
  const roundsWithUserParticipation = roundDataAndUserTickets.filter((round) => round.userTickets.length > 0)
  const idsForLotteriesNodeCall = roundsWithUserParticipation.map((round) => round.roundId)

  const lotteriesNodeData = await fetchMultipleLotteries(idsForLotteriesNodeCall)

  const graphResponse = await getGraphLotteryUser(account)
  const mergedRoundData = applyNodeDataToUserGraphResponse(lotteriesNodeData, graphResponse.rounds)

  // uses - TOTAL TICKETS,
  //  account (but as an 'isloaded')
  // status - filtering on FinishedRoundTable, whether to show FinishedRoundTable
  // round id - display & sort
  // endTime - display
  // claimed - for a visual on the histories chart
  //

  // Find out if user has any tickets in any of these lotteries
  // See if they have claimed any of those tickets
  // Get status of that lottery from node

  //   debugger // eslint-disable-line
  // graphResponse.rounds {
  // claimed: null
  // status: "Open"
  // endTime: "1625767200"
  // lotteryId: "12"
  // totalTickets: "10"
  // }

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

export default getUserLotteryData
