import React from 'react'
import { Button, Modal } from '@rug-zombie-libs/uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'


const WarningModal: React.FC<{ url, onDismiss?: () => void }> = ({ url, onDismiss }) => {

  return (
    <Modal title="WarningModalWarning" onDismiss={onDismiss}>
      <TicketsList>
        WarningModalLottery ticket purchases are final.
        <br />
        WarningModalYour CAKE will not be returned to you after you spend it to buy tickets.
        <br />
        WarningModalTickets are only valid for one lottery draw, and will be burned after the draw.
        <br />
      </TicketsList>
      <ModalActions>
        <Button as="a" external href={url} width="100%" onClick={onDismiss}>
          I understand
        </Button>
      </ModalActions>
    </Modal>
  )
}

const TicketsList = styled.div`
  text-align: left;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default WarningModal;
