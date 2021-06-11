import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { UserLotteryHistory, PastLotteryRound, LotteryRound } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import makeBatchRequest from 'utils/makeBatchRequest'

const lotteryContract = getLotteryV2Contract()

export const fetchLottery = async (lotteryId: string): Promise<LotteryRound> => {
  try {
    const lotteryData = await lotteryContract.methods.viewLottery(lotteryId).call()
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
    const priceTicketInCakeAsBN = new BigNumber(priceTicketInCake as string)
    const amountCollectedInCakeAsBN = new BigNumber(amountCollectedInCake as string)
    const statusKey = Object.keys(LotteryStatus)[status]
    return {
      isLoading: false,
      status: LotteryStatus[statusKey],
      startTime,
      endTime,
      priceTicketInCake: priceTicketInCakeAsBN.toJSON(),
      discountDivisor,
      treasuryFee,
      firstTicketId,
      lastTicketId,
      amountCollectedInCake: amountCollectedInCakeAsBN.toJSON(),
      finalNumber,
      cakePerBracket,
      countWinnersPerBracket,
      rewardsBreakdown,
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
      finalNumber: '',
      cakePerBracket: [],
      countWinnersPerBracket: [],
      rewardsBreakdown: [],
    }
  }
}

export const fetchPublicData = async () => {
  try {
    const [currentLotteryId, maxNumberTicketsPerBuy] = (await makeBatchRequest([
      lotteryContract.methods.currentLotteryId().call,
      lotteryContract.methods.maxNumberTicketsPerBuy().call,
    ])) as [string, string]
    return {
      currentLotteryId,
      maxNumberTicketsPerBuy,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuy: null,
    }
  }
}

export const processRawTicketData = (rawTicketResponse): LotteryTicket[] => {
  const ticketIds = rawTicketResponse[0]
  const ticketNumbers = rawTicketResponse[1]
  const ticketStatuses = rawTicketResponse[2]

  return ticketIds.map((ticketId, index) => {
    return {
      id: ticketId,
      number: ticketNumbers[index],
      status: ticketStatuses[index],
    }
  })
}

export const fetchTickets = async (account: string, lotteryId: string, cursor: number): Promise<LotteryTicket[]> => {
  try {
    const userTickets = await lotteryContract.methods
      .viewUserTicketNumbersAndStatusesForLottery(account, lotteryId, cursor, 1000)
      .call()
    const completeTicketData = processRawTicketData(userTickets)
    return completeTicketData
  } catch (error) {
    return null
  }
}

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
