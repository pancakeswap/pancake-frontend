import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryRoundGraphEntity, UserTicketsResponse } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { processRawTicketsResponse } from './helpers'

interface RoundDataAndUserTickets {
  roundId: string
  userTickets: LotteryTicket[]
  finalNumber: string
}

const lotteryAddress = getLotteryV2Address()

const getCakeRewardsForTickets = async (
  winningTickets: LotteryTicket[],
): Promise<{ ticketsWithRewards: LotteryTicket[]; cakeTotal: BigNumber }> => {
  const calls = winningTickets.map((winningTicket) => {
    const { roundId, id, rewardBracket } = winningTicket
    return {
      name: 'viewRewardsForTicketId',
      address: lotteryAddress,
      params: [roundId, id, rewardBracket],
    }
  })
  const cakeRewards = await multicallv2(lotteryV2Abi, calls)

  const cakeTotal = cakeRewards.reduce((a: BigNumber, b: ethers.BigNumber[]) => {
    return a.plus(new BigNumber(b[0].toString()))
  }, BIG_ZERO)
  const ticketsWithRewards = winningTickets.map((winningTicket, index) => {
    return { ...winningTicket, cakeReward: cakeRewards[index] }
  })
  // TODO: Remove log. To help in testing when verifying winning tickets.
  console.log('winning tickets: ', ticketsWithRewards)
  return { ticketsWithRewards, cakeTotal }
}

const getRewardBracket = (ticketNumber: string, finalNumber: string): number => {
  // Winning numbers are evaluated right-to-left in the smart contract, so we reverse their order for validation here:
  // i.e. '1123456' should be evaluated as '6543211'
  const ticketNumAsArray = ticketNumber.split('').reverse()
  const winningNumsAsArray = finalNumber.split('').reverse()
  const matchingNumbers = []

  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  for (let index = 0; index < winningNumsAsArray.length - 1; index++) {
    if (ticketNumAsArray[index] !== winningNumsAsArray[index]) {
      break
    }
    matchingNumbers.push(ticketNumAsArray[index])
  }

  // Reward brackets refer to indexes, 0 = 1 match, 5 = 6 matches. Deduct 1 from matchingNumbers' length to get the reward bracket
  const rewardBracket = matchingNumbers.length - 1
  return rewardBracket
}

const getWinningTickets = async (roundDataAndUserTickets: RoundDataAndUserTickets): Promise<LotteryTicketClaimData> => {
  const { roundId, userTickets, finalNumber } = roundDataAndUserTickets

  const ticketsWithRewardBrackets = userTickets.map((ticket) => {
    return {
      roundId,
      id: ticket.id,
      number: ticket.number,
      rewardBracket: getRewardBracket(ticket.number, finalNumber),
    }
  })
  // TODO: Remove log. To help in testing when verifying winning tickets.
  console.log(`all tickets round #${roundId}`, ticketsWithRewardBrackets)

  // A rewardBracket of -1 means no matches. 0 and above means there has been a match
  const winningTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return ticket.rewardBracket >= 0
  })

  if (winningTickets.length > 0) {
    const { ticketsWithRewards, cakeTotal } = await getCakeRewardsForTickets(winningTickets)
    return { ticketsWithRewards, cakeTotal, roundId }
  }
  return null
}

const getWinningNumbersForRound = (targetRoundId: string, lotteriesData: LotteryRoundGraphEntity[]) => {
  const targetRound = lotteriesData.find((pastLottery) => pastLottery.id === targetRoundId)
  return targetRound?.finalNumber
}

const fetchUnclaimedUserRewards = async (
  account: string,
  currentLotteryId: string,
  userLotteryData: LotteryUserGraphEntity,
  lotteriesData: LotteryRoundGraphEntity[],
): Promise<LotteryTicketClaimData[]> => {
  // eslint-disable-next-line no-param-reassign
  const { rounds } = userLotteryData
  const cursor = 0
  const limit = 1000

  // If there is no user round history - return an empty array
  if (rounds.length === 0) {
    return []
  }

  // If the web3 provider account doesn't equal the userLotteryData account, return an empty array - this is effectively a loading state as the user switches accounts
  if (userLotteryData.account.toLowerCase() !== account.toLowerCase()) {
    return []
  }

  const filteredForCurrentRound = rounds.filter((round) => {
    return round.lotteryId !== currentLotteryId
  })

  const filteredForAlreadyClaimed = filteredForCurrentRound.filter((round) => {
    return !round.claimed
  })

  // If there are any rounds tickets haven't been claimed for, check user tickets for those rounds
  if (filteredForAlreadyClaimed.length > 0) {
    const calls = filteredForAlreadyClaimed.map((round) => ({
      name: 'viewUserTicketNumbersAndStatusesForLottery',
      address: lotteryAddress,
      params: [account, round.lotteryId, cursor, limit],
    }))
    const roundIds = filteredForAlreadyClaimed.map((round) => round.lotteryId)
    const rawTicketData = (await multicallv2(lotteryV2Abi, calls)) as UserTicketsResponse[]

    const roundDataAndUserTickets = rawTicketData.map((roundTicketData, index) => {
      return {
        roundId: roundIds[index],
        userTickets: processRawTicketsResponse(roundTicketData),
        finalNumber: getWinningNumbersForRound(roundIds[index], lotteriesData),
      }
    })

    const winningTicketsForPastRounds = await Promise.all(
      roundDataAndUserTickets.map((roundData) => getWinningTickets(roundData)),
    )
    // Remove null values (returned when no winning tickets found for past round)
    return winningTicketsForPastRounds.filter((winningTicketData) => winningTicketData !== null)
  }
  // All rounds claimed, return empty array
  return []
}

export default fetchUnclaimedUserRewards
