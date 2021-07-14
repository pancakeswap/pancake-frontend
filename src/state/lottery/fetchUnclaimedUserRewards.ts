import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { LotteryStatus, LotteryTicket, LotteryTicketClaimData } from 'config/constants/types'
import { LotteryUserGraphEntity, LotteryRoundGraphEntity } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  getViewUserTicketInfoCalls,
  mergeViewUserTicketInfoMulticallResponse,
  processRawTicketsResponse,
} from './helpers'

interface RoundDataAndUserTickets {
  roundId: string
  userTickets: LotteryTicket[]
  finalNumber: string
}

const lotteryAddress = getLotteryV2Address()

const fetchCakeRewardsForTickets = async (
  winningTickets: LotteryTicket[],
): Promise<{ ticketsWithUnclaimedRewards: LotteryTicket[]; cakeTotal: BigNumber }> => {
  const calls = winningTickets.map((winningTicket) => {
    const { roundId, id, rewardBracket } = winningTicket
    return {
      name: 'viewRewardsForTicketId',
      address: lotteryAddress,
      params: [roundId, id, rewardBracket],
    }
  })

  try {
    const cakeRewards = await multicallv2(lotteryV2Abi, calls)

    const cakeTotal = cakeRewards.reduce((accum: BigNumber, cakeReward: ethers.BigNumber[]) => {
      return accum.plus(new BigNumber(cakeReward[0].toString()))
    }, BIG_ZERO)

    const ticketsWithUnclaimedRewards = winningTickets.map((winningTicket, index) => {
      return { ...winningTicket, cakeReward: cakeRewards[index] }
    })
    return { ticketsWithUnclaimedRewards, cakeTotal }
  } catch (error) {
    console.error(error)
    return { ticketsWithUnclaimedRewards: null, cakeTotal: null }
  }
}

const getRewardBracketByNumber = (ticketNumber: string, finalNumber: string): number => {
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

export const getWinningTickets = async (
  roundDataAndUserTickets: RoundDataAndUserTickets,
): Promise<LotteryTicketClaimData> => {
  const { roundId, userTickets, finalNumber } = roundDataAndUserTickets

  const ticketsWithRewardBrackets = userTickets.map((ticket) => {
    return {
      roundId,
      id: ticket.id,
      number: ticket.number,
      status: ticket.status,
      rewardBracket: getRewardBracketByNumber(ticket.number, finalNumber),
    }
  })

  // A rewardBracket of -1 means no matches. 0 and above means there has been a match
  const allWinningTickets = ticketsWithRewardBrackets.filter((ticket) => {
    return ticket.rewardBracket >= 0
  })

  // If ticket.status is true, the ticket has already been claimed
  const unclaimedWinningTickets = allWinningTickets.filter((ticket) => {
    return !ticket.status
  })

  if (unclaimedWinningTickets.length > 0) {
    const { ticketsWithUnclaimedRewards, cakeTotal } = await fetchCakeRewardsForTickets(unclaimedWinningTickets)
    return { ticketsWithUnclaimedRewards, allWinningTickets, cakeTotal, roundId }
  }

  if (allWinningTickets.length > 0) {
    return { ticketsWithUnclaimedRewards: null, allWinningTickets, cakeTotal: null, roundId }
  }

  return null
}

const getWinningNumbersForRound = (targetRoundId: string, lotteriesData: LotteryRoundGraphEntity[]) => {
  const targetRound = lotteriesData.find((pastLottery) => pastLottery.id === targetRoundId)
  return targetRound?.finalNumber
}

export const fetchUserTicketsForMultipleRounds = async (
  roundsToCheck: { totalTickets: string; lotteryId: string }[],
  account: string,
) => {
  // Build calls with data to help with merging multicall responses
  const callsWithRoundData = roundsToCheck.map((round) => {
    const totalTickets = parseInt(round.totalTickets, 10)
    const calls = getViewUserTicketInfoCalls(totalTickets, account, round.lotteryId)
    return { calls, lotteryId: round.lotteryId, count: calls.length }
  })

  // Batch all calls across all rounds
  const multicalls = [].concat(...callsWithRoundData.map((callWithRoundData) => callWithRoundData.calls))
  try {
    const multicallRes = await multicallv2(lotteryV2Abi, multicalls, { requireSuccess: false })
    // Use callsWithRoundData to slice multicall responses by round
    const multicallResPerRound = []
    let resCount = 0
    for (let i = 0; i < callsWithRoundData.length; i += 1) {
      const callOptions = callsWithRoundData[i]

      const singleRoundResponse = multicallRes.slice(resCount, resCount + callOptions.count)
      // Don't push null responses values - can happen when the check is using fallback behaviour because it has no subgraph past rounds
      multicallResPerRound.push(singleRoundResponse.filter((res) => res))
      resCount += callOptions.count
    }
    const mergedMulticallResponse = multicallResPerRound.map((res) => mergeViewUserTicketInfoMulticallResponse(res))

    return mergedMulticallResponse
  } catch (error) {
    console.error(error)
    return []
  }
}

const fetchUnclaimedUserRewards = async (
  account: string,
  userLotteryData: LotteryUserGraphEntity,
  lotteriesData: LotteryRoundGraphEntity[],
): Promise<LotteryTicketClaimData[]> => {
  const { rounds } = userLotteryData

  // If there is no user round history - return an empty array
  if (rounds.length === 0) {
    return []
  }

  // If the web3 provider account doesn't equal the userLotteryData account, return an empty array - this is effectively a loading state as the user switches accounts
  if (userLotteryData.account.toLowerCase() !== account.toLowerCase()) {
    return []
  }

  // Filter out non-claimable rounds
  const claimableRounds = rounds.filter((round) => {
    return round.status.toLowerCase() === LotteryStatus.CLAIMABLE
  })

  // If there are any rounds tickets haven't been claimed for, OR a user has over 100 tickets in a round - check user tickets for those rounds
  const roundsToCheck = claimableRounds.filter((round) => {
    return !round.claimed || parseInt(round.totalTickets, 10) > 100
  })

  if (roundsToCheck.length > 0) {
    const rawUserTicketData = await fetchUserTicketsForMultipleRounds(roundsToCheck, account)

    if (rawUserTicketData.length === 0) {
      // In case of error with ticket calls, return empty array
      return []
    }

    const roundIds = roundsToCheck.map((round) => round.lotteryId)
    const roundDataAndUserTickets = rawUserTicketData.map((rawRoundTicketData, index) => {
      return {
        roundId: roundIds[index],
        userTickets: processRawTicketsResponse(rawRoundTicketData),
        finalNumber: getWinningNumbersForRound(roundIds[index], lotteriesData),
      }
    })

    const winningTicketsForPastRounds = await Promise.all(
      roundDataAndUserTickets.map((roundData) => getWinningTickets(roundData)),
    )

    // Filter out null values (returned when no winning tickets found for past round)
    const roundsWithWinningTickets = winningTicketsForPastRounds.filter(
      (winningTicketData) => winningTicketData !== null,
    )

    // Filter to only rounds with unclaimed tickets
    const roundsWithUnclaimedWinningTickets = roundsWithWinningTickets.filter(
      (winningTicketData) => winningTicketData.ticketsWithUnclaimedRewards,
    )

    return roundsWithUnclaimedWinningTickets
  }
  // All rounds claimed, return empty array
  return []
}

export default fetchUnclaimedUserRewards
