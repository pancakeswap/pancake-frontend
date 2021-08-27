import { LotteryTicket } from 'config/constants/types'
import { useEffect, useReducer } from 'react'
import { parseRetrievedNumber } from '../../helpers'
import generateTicketNumbers from './generateTicketNumbers'

export interface Ticket {
  id: number
  numbers: string[]
  duplicateWith: number[]
  isComplete: boolean
}

export interface TicketsState {
  tickets: Ticket[]
  allComplete: boolean
}

const getInitialState = ({
  amount,
  userCurrentTickets,
}: {
  amount: number
  userCurrentTickets: LotteryTicket[]
}): TicketsState => {
  const randomTickets = generateTicketNumbers(amount, userCurrentTickets)
  const randomTicketsAsStringArray = randomTickets.map((ticket) => parseRetrievedNumber(ticket.toString()).split(''))
  const tickets = Array.from({ length: amount }, (_, i) => i + 1).map((index) => ({
    id: index,
    numbers: randomTicketsAsStringArray[index - 1],
    duplicateWith: [],
    isComplete: true,
  }))
  return {
    tickets,
    allComplete: true,
  }
}

const reducer = (state: TicketsState, action: any) => {
  switch (action.type) {
    case 'updateTicket': {
      const tickets = [...state.tickets]
      const { ticketId, newNumbers } = action.payload

      const newDuplicates = state.tickets.filter(
        (ticket) => ticket.id !== ticketId && ticket.isComplete && ticket.numbers.join('') === newNumbers.join(''),
      )

      // If ticket was duplicate but not duplicate anymore with this update
      // go through previously considered duplicates and remove id of this ticket
      // from their duplicateWith array
      const prevDuplicates = tickets[ticketId - 1].duplicateWith
      prevDuplicates.forEach((prevTicketId) => {
        if (!newDuplicates.map(({ id }) => id).includes(prevTicketId)) {
          const dupsToUpdate = [...tickets[prevTicketId - 1].duplicateWith]
          const indexToRemove = dupsToUpdate.findIndex((id) => id === ticketId)
          dupsToUpdate.splice(indexToRemove, 1)
          tickets[prevTicketId - 1] = {
            ...tickets[prevTicketId - 1],
            duplicateWith: dupsToUpdate,
          }
        }
      })

      // If found duplicates - update their duplicateWith array
      if (newDuplicates.length !== 0) {
        newDuplicates.forEach((duplicate) => {
          tickets[duplicate.id - 1] = {
            ...duplicate,
            duplicateWith: [...duplicate.duplicateWith, ticketId],
          }
        })
      }

      const updatedTicket = {
        id: ticketId,
        numbers: newNumbers,
        duplicateWith: newDuplicates.map((ticket) => ticket.id),
        isComplete: newNumbers.join('').length === 6,
      }
      tickets[ticketId - 1] = updatedTicket

      // Check if all tickets are filled
      const allComplete = tickets.every((ticket) => ticket.isComplete)

      return {
        tickets,
        allComplete,
      }
    }
    case 'reset':
      return getInitialState({ amount: action.payload.amount, userCurrentTickets: action.payload.userCurrentTickets })
    default:
      throw new Error()
  }
}

export type UpdateTicketAction = (ticketId: number, newNumbers: string[]) => void

export const useTicketsReducer = (
  amount: number,
  userCurrentTickets: LotteryTicket[],
): [UpdateTicketAction, () => void, Ticket[], boolean, () => number[]] => {
  const [state, dispatch] = useReducer(reducer, { amount, userCurrentTickets }, getInitialState)

  useEffect(() => {
    dispatch({ type: 'reset', payload: { amount, userCurrentTickets } })
  }, [amount, userCurrentTickets])

  const updateTicket = (ticketId: number, newNumbers: string[]) => {
    dispatch({ type: 'updateTicket', payload: { ticketId, newNumbers } })
  }

  const randomize = () => {
    dispatch({ type: 'reset', payload: { amount, userCurrentTickets } })
  }

  const getTicketsForPurchase = () => {
    return state.tickets.map((ticket) => {
      const reversedTicket = [...ticket.numbers].map((num) => parseInt(num, 10)).reverse()
      reversedTicket.unshift(1)
      const ticketAsNumber = parseInt(reversedTicket.join(''), 10)
      return ticketAsNumber
    })
  }

  return [updateTicket, randomize, state.tickets, state.allComplete, getTicketsForPurchase]
}
