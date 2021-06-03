import { LotteryRound } from 'state/types'

const generateRandomNumber = () => Math.floor(Math.random() * 1000000) + 1000000

// TODO: Tests
/**
 * Generate a random number of unique, 7-digit lottery numbers between 1000000 & 1999999
 */
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

export const getNextLotteryEvent = (currentLotteryRound: LotteryRound) => {
  // TODO: This is effectively placeholder for where logic should go to fetch the next lottery timestamp
  return currentLotteryRound.endTime
}

export default generateTicketNumbers
