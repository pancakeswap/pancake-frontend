import { LotteryTicket } from 'config/constants/types'

/**
 * Return a random number between (and inclusive of) minNumber & maxNumber.
 */
function generateRandomNumber(minNumber: number, maxNumber: number): number {
  const minInt = Math.ceil(minNumber)
  const maxInt = Math.floor(maxNumber)
  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt) // The maximum is inclusive and the minimum is inclusive
}

/**
 * Generate a specific number of unique, 7-digit lottery numbers between 1000000 & 1999999
 */
const generateTicketNumbers = (
  numberOfTickets: number,
  userCurrentTickets?: LotteryTicket[],
  minNumber = 1000000,
  maxNumber = 1999999,
): number[] => {
  // Populate array with existing tickets (if they have them) to ensure no duplicates when generating new numbers
  const existingTicketNumbers =
    userCurrentTickets?.length > 0
      ? userCurrentTickets.map((ticket) => {
          return parseInt(ticket?.number)
        })
      : []
  const generatedTicketNumbers = [...existingTicketNumbers]

  for (let count = 0; count < numberOfTickets; count++) {
    let randomNumber = generateRandomNumber(minNumber, maxNumber)
    while (generatedTicketNumbers.includes(randomNumber)) {
      // Catch for duplicates - generate a new number until the array doesn't include the random number generated
      randomNumber = generateRandomNumber(minNumber, maxNumber)
    }
    generatedTicketNumbers.push(randomNumber)
  }

  // Filter out the users' existing tickets
  const ticketsToBuy =
    userCurrentTickets?.length > 0
      ? generatedTicketNumbers.filter((ticketNumber) => {
          return !existingTicketNumbers.includes(ticketNumber)
        })
      : generatedTicketNumbers

  return ticketsToBuy
}

export default generateTicketNumbers
