import React from 'react'
import { Button, Modal } from '@pancakeswap-libs/uikit'
import ModalActions from 'components/ModalActions'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'

const WarningModal: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const TranslateString = useI18n()

  return (
    <Modal title={TranslateString(466, 'Warning')} onDismiss={onDismiss}>
      <TicketsList>
        {TranslateString(468, 'Lottery ticket purchases are final.')}
        <br />
        {TranslateString(470, 'Your CAKE will not be returned to you after you spend it to buy tickets.')}
        <br />
        {TranslateString(472, 'Tickets are only valid for one lottery draw, and will be burned after the draw.')}
        <br />
        {TranslateString(
          474,
          'Buying tickets does not guarantee you will win anything. Please only participate once you understand the risks.',
        )}
      </TicketsList>
      <ModalActions>
        <Button width="100%" onClick={onDismiss}>
          {TranslateString(476, 'I understand')}
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

export default WarningModal
