import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryUserGraphEntity } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { getRoundIdsArray, fetchMultipleLotteries, NUM_ROUNDS_TO_FETCH_FROM_NODES } from './helpers'
import { fetchUserTicketsForMultipleRounds } from './fetchUnclaimedUserRewards'

const lotteryContract = getLotteryV2Contract()
// Variable used to determine how many past rounds should be populated by node data rather than subgraph

const getUserLotteryData = async (account: string, currentLotteryId: string): Promise<LotteryUserGraphEntity> => {
  const idsForNodeCall = getRoundIdsArray(currentLotteryId)
  const ticketsToRequestPerRound = '5000'

  const blindRoundData = idsForNodeCall.map((roundId) => {
    return {
      totalTickets: ticketsToRequestPerRound,
      lotteryId: roundId,
    }
  })
  const rawUserTicketData = await fetchUserTicketsForMultipleRounds(blindRoundData, account)

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

  const graphResponse = await getGraphLotteryUser(account)

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
