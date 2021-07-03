import BigNumber from 'bignumber.js'
import { LotteryTicket } from 'config/constants/types'
import { LotteryResponse, LotteryRound, LotteryRoundUserTickets } from 'state/types'

/**
 * Remove the '1' and reverse the digits in a lottery number retreived from the smart contract
 */
export const parseRetreivedNumber = (number: string): string => {
  const numberAsArray = number.split('')
  // remove the '1' from the number
  numberAsArray.splice(0, 1)
  // reverse it
  numberAsArray.reverse()
  return numberAsArray.join('')
}

export const parseUnclaimedTicketDataForClaimCall = (
  ticketsWithUnclaimedRewards: LotteryTicket[],
  lotteryId: string,
) => {
  const ticketIds = ticketsWithUnclaimedRewards.map((ticket) => {
    return ticket.id
  })
  const brackets = ticketsWithUnclaimedRewards.map((ticket) => {
    return ticket.rewardBracket
  })
  return { lotteryId, ticketIds, brackets }
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
}

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  ...timeOptions,
}

export const processLotteryResponse = (
  lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
  const {
    priceTicketInCake: priceTicketInCakeAsString,
    discountDivisor: discountDivisorAsString,
    amountCollectedInCake: amountCollectedInCakeAsString,
  } = lotteryData

  const discountDivisor = new BigNumber(discountDivisorAsString)
  const priceTicketInCake = new BigNumber(priceTicketInCakeAsString)
  const amountCollectedInCake = new BigNumber(amountCollectedInCakeAsString)

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
