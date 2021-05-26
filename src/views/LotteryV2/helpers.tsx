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

export default generateTicketNumbers
