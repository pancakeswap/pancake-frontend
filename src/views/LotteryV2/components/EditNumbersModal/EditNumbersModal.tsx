import React from 'react'
import styled from 'styled-components'
import { Modal, Text, Flex, Button, Ticket as TicketIcon } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import TicketInput from './TicketInput'
import { useTicketsReducer, TicketsState } from './useTicketsReducer'

const StyledModal = styled(Modal)`
  min-width: 280px;
  max-width: 320px;
  max-height: 512px;

  & div:nth-child(2) {
    padding: 0;
  }
`

const ScrollableContainer = styled.div`
  height: 310px;
  overflow-y: scroll;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
  padding: 24px;
`

const EditNumbersModal: React.FC<{
  amount: number
  preloadState: TicketsState
  onConfirmEdits: React.Dispatch<React.SetStateAction<TicketsState>>
  onDismiss?: () => void
}> = ({ amount, preloadState, onConfirmEdits, onDismiss }) => {
  const { theme } = useTheme()
  const [updateTicket, tickets, allComplete, containsDuplicates] = useTicketsReducer(amount, preloadState)
  return (
    <StyledModal title="Edit numbers" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <ScrollableContainer>
        <Flex justifyContent="space-between" mb="24px">
          <Flex>
            <TicketIcon width="24px" height="24px" />
            <Text bold ml="4px">
              Total tickets:
            </Text>
          </Flex>
          <Text bold>{amount}</Text>
        </Flex>
        <Text fontSize="12px" color="textSubtle">
          Available numbers: 0-9
        </Text>
        <Text fontSize="12px" color="textSubtle" mb="24px">
          Click “Confirm edits” at the bottom of the list to confirm your changes.
        </Text>
        {tickets.map((ticket) => (
          <TicketInput
            key={ticket.id}
            ticket={ticket}
            duplicateWith={ticket.duplicateWith}
            updateTicket={updateTicket}
          />
        ))}
      </ScrollableContainer>
      <Flex flexDirection="column" justifyContent="center" m="24px">
        <Button
          disabled={!allComplete}
          variant={containsDuplicates ? 'danger' : 'primary'}
          onClick={() => {
            onConfirmEdits({ tickets, allComplete, containsDuplicates })
            onDismiss()
          }}
        >
          {allComplete && containsDuplicates ? 'Confirm anyway' : 'Confirm numbers'}
        </Button>
        <Button variant="text" onClick={onDismiss}>
          Cancel edits
        </Button>
      </Flex>
    </StyledModal>
  )
}

export default EditNumbersModal
