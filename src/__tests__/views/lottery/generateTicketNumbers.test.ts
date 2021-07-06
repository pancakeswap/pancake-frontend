import generateTicketNumbers from 'views/LotteryV2/components/BuyTicketsModal/generateTicketNumbers'

const withoutExistingNumbers = [
  {
    startingNumber: 1000000,
    endingNumber: 1000099,
    numbersToGenerate: 100,
  },
  {
    startingNumber: 1998000,
    endingNumber: 1999999,
    numbersToGenerate: 2000,
  },
  {
    startingNumber: 1156791,
    endingNumber: 1161790,
    numbersToGenerate: 5000,
  },
]

const withExistingTickets = [
  {
    ...withoutExistingNumbers[0],
    numbersToGenerate: 99,
    existingTickets: [{ id: '1', number: '1000000' }],
  },
  {
    ...withoutExistingNumbers[1],
    numbersToGenerate: 1996,
    existingTickets: [
      { id: '1', number: '1998000' },
      { id: '2', number: '1998001' },
      { id: '3', number: '1998002' },
      { id: '4', number: '1998003' },
    ],
  },
  {
    ...withoutExistingNumbers[2],
    numbersToGenerate: 4995,
    existingTickets: [
      { id: '1', number: '1156791' },
      { id: '2', number: '1156991' },
      { id: '3', number: '1161780' },
      { id: '4', number: '1161789' },
      { id: '5', number: '1161790' },
    ],
  },
]

describe('generateTicketNumbers', () => {
  it(`generates 10 unique numbers between 0 & 9`, () => {
    const ticketsArray = generateTicketNumbers(10, null, 0, 9)
    const expectedNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    expectedNumbers.forEach((expectedNumber) => {
      expect(ticketsArray).toContain(expectedNumber)
    })
    expect(ticketsArray).toHaveLength(10)
    expect(ticketsArray).not.toContain(-1)
    expect(ticketsArray).not.toContain(10)
  })

  withoutExistingNumbers.forEach((data) => {
    const { startingNumber, endingNumber, numbersToGenerate } = data

    it(`generates ${numbersToGenerate} unique numbers between ${startingNumber} & ${endingNumber} WITHOUT existing numbers`, () => {
      const ticketsArray = generateTicketNumbers(numbersToGenerate, null, startingNumber, endingNumber)

      const expectedNumbers = []
      for (let i = startingNumber; i < endingNumber; i++) {
        expectedNumbers.push(i)
      }

      expectedNumbers.forEach((expectedNumber) => {
        expect(ticketsArray).toContain(expectedNumber)
      })
      expect(ticketsArray).toHaveLength(numbersToGenerate)
      expect(ticketsArray).not.toContain(startingNumber - 1)
      expect(ticketsArray).not.toContain(endingNumber + 1)
    })
  })

  withExistingTickets.forEach((data) => {
    const { startingNumber, endingNumber, numbersToGenerate, existingTickets } = data
    const numberExistingTickets = existingTickets.length

    it(`generates ${numbersToGenerate} unique numbers between ${startingNumber} & ${endingNumber} WITH ${numberExistingTickets} existing numbers`, () => {
      const ticketsArray = generateTicketNumbers(numbersToGenerate, existingTickets, startingNumber, endingNumber)
      expect(ticketsArray).toHaveLength(numbersToGenerate)
      existingTickets.forEach((existingTicket) => expect(ticketsArray).not.toContain(existingTicket.number))
    })
  })
})
