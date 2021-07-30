import React from 'react'
import { Button, Modal } from '@rug-zombie-libs/uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'


const WarningDepositRugModal: React.FC<{ onDismiss?: () => void, onClick: any }> = ({ onDismiss, onClick }) => {

  const action = (onDismissAction) => {
    onDismissAction()
    onClick()
  }

  return (
    <Modal title="You don't get token this back!" onDismiss={onDismiss}>
      <TicketsList>
        Warning: this rugged token is used for verification only.
        <br />
        Once deposited, the rugged token is unrecoverable.
        <br />
        You can deposit as little as one token. Although if you would like to clean up your wallet, feel free to deposit as much as you would like.
        <br />
      </TicketsList>
      <ModalActions>
        <Button width="100%" onClick={() => {action(onDismiss)}}>
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

export default WarningDepositRugModal;
