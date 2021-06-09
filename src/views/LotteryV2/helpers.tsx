import { LotteryTicket } from 'config/constants/types'

/**
 * Return a random number between 1000000 & 1999999
 */
const generateRandomNumber = () => Math.floor(Math.random() * 1000000) + 1000000

// TODO: Tests
/**
 * Generate a specific number of unique, 7-digit lottery numbers between 1000000 & 1999999
 */
export const generateTicketNumbers = (numberOfTickets: number, userCurrentTickets?: LotteryTicket[]): number[] => {
  // Populate array with existing tickets (if they have them) to ensure no duplicates when generating new numbers
  const existingTicketNumbers = userCurrentTickets.map((ticket) => {
    return parseInt(ticket?.number)
  })
  const generatedTicketNumbers = [...existingTicketNumbers]

  for (let count = 0; count < numberOfTickets; count++) {
    let randomNumber = generateRandomNumber()
    while (generatedTicketNumbers.includes(randomNumber)) {
      // Catch for duplicates - generate a new number until the array doesn't include the random number generated
      randomNumber = generateRandomNumber()
    }
    generatedTicketNumbers.push(randomNumber)
  }

  // Filter out the users' existing tickets
  const ticketsToBuy =
    userCurrentTickets.length > 0
      ? generatedTicketNumbers.filter((ticketNumber) => {
          return !existingTicketNumbers.includes(ticketNumber)
        })
      : generatedTicketNumbers

  return ticketsToBuy
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

export default generateTicketNumbers
