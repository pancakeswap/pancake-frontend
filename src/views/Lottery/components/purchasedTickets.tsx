import React from 'react'
import styled from 'styled-components'

interface PurchasedTicketsProps {
  myTicketNumbers: Array<any>
}

const PurchasedTickets: React.FC<PurchasedTicketsProps> = ({ myTicketNumbers }) => {
  const listItems = myTicketNumbers.map((number) => <p key={number}>{number.toString()}</p>)

  return (
    <div>
      <Title>My tickets(Current Round)</Title>
      <TicketsList>
        <h2>{listItems}</h2>
      </TicketsList>
    </div>
  )
}

const TicketsList = styled.div`
  margin-top: 0.5em;
  padding-left: 5em;
  padding-right: 5em;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`
const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  margin-top: 1em;
`

export default PurchasedTickets
