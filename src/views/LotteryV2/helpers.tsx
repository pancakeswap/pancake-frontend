import { LotteryRound } from 'state/types'

const generateRandomNumber = () => Math.floor(Math.random() * 1000000) + 1000000

// TODO: Tests
export const generateTicketNumbers = (numberOfTickets: number): number[] => {
  const ticketNumbers = []
  for (let count = 0; count < numberOfTickets; count++) {
    let randomNumber = generateRandomNumber()
    while (ticketNumbers.includes(randomNumber)) {
      // Catch for duplicates - generate a new number until the array doesn't include the random number generated
      randomNumber = generateRandomNumber()
    }

    ticketNumbers.push(randomNumber)
  }
  return ticketNumbers
}

export const getNextLotteryEvent = (currentLotteryRound: LotteryRound) => {
  // TODO: This is effectively placeholder for where logic should go to fetch the next lottery timestamp
  return currentLotteryRound.endTime
}

export default generateTicketNumbers
