import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { UserLotteryHistory, PastLotteryRound } from 'state/types'

export const getPastLotteries = async (): Promise<PastLotteryRound[]> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getLotteries {
        lotteries(first: 1000) {
          id
          totalUsers
          totalTickets
          status
          winningNumbers
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

export const getUserPastLotteries = async (account: string): Promise<UserLotteryHistory> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getUserHistory($account: ID!) {
        user(id: $account) {
          totalTickets
          totalCake
          participation {
            lottery {
              id
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

  // TODO: req should just match desired format rather than reformating
  const formattedUser = user && {
    totalCake: user.totalCake,
    totalTickets: user.totalTickets,
    pastRounds: user.participation.map((round) => {
      return {
        lotteryId: round?.lottery?.id,
        claimed: round?.claimed,
        totalTickets: round?.totalTickets,
      }
    }),
  }
  return formattedUser
}
