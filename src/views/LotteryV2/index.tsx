import React, { useState } from 'react'
import { Text, Flex, Button, useModal } from '@pancakeswap/uikit'
import { EditNumbersModal, TicketsState } from './components/EditNumbersModal'
import TicketsNumberButton from './components/TicketsNumberButton'

const LotteryV2 = () => {
  const [ticketsAmount, setTicketsAmount] = useState(3)
  const [editedTickets, setEditedTickets] = useState<TicketsState>(null)
  const [onPresentBuyTicketsModal] = useModal(
    <EditNumbersModal amount={ticketsAmount} preloadState={editedTickets} onConfirmEdits={setEditedTickets} />,
  )
  const convertedTickets =
    editedTickets &&
    editedTickets.tickets.map((ticket) => {
      const reversedTicket = [...ticket.numbers].map((num) => parseInt(num, 10)).reverse()
      reversedTicket.unshift(1)
      return reversedTicket
    })
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="center" height="100vh">
      <Text>Buy tickets: {ticketsAmount}</Text>
      <Flex mb="16px">
        <TicketsNumberButton onClick={() => setTicketsAmount(5)}>5</TicketsNumberButton>
        <TicketsNumberButton onClick={() => setTicketsAmount(10)}>10</TicketsNumberButton>
        <TicketsNumberButton onClick={() => setTicketsAmount(25)}>25</TicketsNumberButton>
      </Flex>
      <Button onClick={onPresentBuyTicketsModal}>Edit numbers</Button>
      <Flex>
        <Flex flexDirection="column">
          <Text>Your tickets are</Text>
          {editedTickets &&
            editedTickets.tickets.map((ticket) => {
              return <Text>{ticket.numbers.join('')}</Text>
            })}
        </Flex>
        <Flex ml="16px" flexDirection="column">
          <Text>Real tickets</Text>
          {convertedTickets &&
            convertedTickets.map((ticket) => {
              return <Text>{ticket.join('')}</Text>
            })}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LotteryV2
