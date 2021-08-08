import React from 'react'
import { Button, Modal } from '@rug-zombie-libs/uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'


const NftWarningModal: React.FC<{ onDismiss?: () => void, onClick: any }> = ({ onDismiss, onClick }) => {

  const action = (onDismissAction) => {
    onDismissAction()
    onClick()
  }

  return (
    <Modal title="This consumes your NFT!" onDismiss={onDismiss}>
      <TicketsList>
        Once deposited, the NFT is unrecoverable. <br/>
      </TicketsList>
      <ModalActions>
        <Button width="100%" onClick={() => {action(onDismiss)}}>
          I understand. (Queues 2 transactions)
        </Button>
      </ModalActions>
    </Modal>
  )
}

const TicketsList = styled.div`
  text-align: left;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default NftWarningModal;
