import React from 'react'
import { Button, Modal } from '@rug-zombie-libs/uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'


const WarningModal: React.FC<{ url, onDismiss?: () => void }> = ({ url, onDismiss }) => {

  return (
    <Modal title="WarningModalWarning" onDismiss={onDismiss}>
      <TicketsList>
      We do not recommend buying known scammed tokens, 
        <br />
        this is highly risky and may result in financial lost and even rewarding the scammers. Trade cautiously.
        <br />
        You can always wait for our secondary market to buy these NFTs from others.
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
