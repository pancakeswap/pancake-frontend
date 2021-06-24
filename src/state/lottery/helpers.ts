import BigNumber from 'bignumber.js'
import { request, gql } from 'graphql-request'
import { ethers } from 'ethers'
import { GRAPH_API_LOTTERY } from 'config/constants/endpoints'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { UserLotteryData, PastLotteryRound, LotteryRound, UserTicketsResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'

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
  const ticketIds = ticketsResponse[0]
  const ticketNumbers = ticketsResponse[1]
  const ticketStatuses = ticketsResponse[2]

  return ticketIds.map((ticketId, index) => {
    return {
      id: ticketId.toString(),
      number: ticketNumbers[index].toString(),
      status: ticketStatuses[index],
    }
  })
}

export const fetchTickets = async (account: string, lotteryId: string): Promise<LotteryTicket[]> => {
  const cursor = 0
  const requestMax = 1000
  try {
    const userTickets = await lotteryContract.methods
      .viewUserTicketNumbersAndStatusesForLottery(account, lotteryId, cursor, requestMax)
      .call()

    const completeTicketData = processRawTicketsResponse(userTickets)
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

export const getUserLotteries = async (account: string): Promise<UserLotteryData> => {
  const response = await request(
    GRAPH_API_LOTTERY,
    gql`
      query getUserHistory($account: ID!) {
        user(id: $account) {
          id
          totalTickets
          totalCake
          rounds {
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

  const formattedUser = user && {
    account: user.id,
    totalCake: user.totalCake,
    totalTickets: user.totalTickets,
    rounds: user.rounds.map((round) => {
      return {
        lotteryId: round?.lottery?.id,
        claimed: round?.claimed,
        totalTickets: round?.totalTickets,
      }
    }),
  }
  return formattedUser
}
