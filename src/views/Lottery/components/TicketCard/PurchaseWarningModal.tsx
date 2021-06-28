import React from 'react'
import { Button, Modal } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const WarningModal: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Warning')} onDismiss={onDismiss}>
      <TicketsList>
        {t('Lottery ticket purchases are final.')}
        <br />
        {t('Your CAKE will not be returned to you after you spend it to buy tickets.')}
        <br />
        {t('Tickets are only valid for one lottery draw, and will be burned after the draw.')}
        <br />
        {t(
          'Buying tickets does not guarantee you will win anything. Please only participate once you understand the risks.',
        )}
      </TicketsList>
      <ModalActions>
        <Button width="100%" onClick={onDismiss}>
          {t('I understand')}
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
