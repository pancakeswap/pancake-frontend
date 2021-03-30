import React from 'react'
import { Modal, Button, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { CompetitionProps } from '../../types'

const RegisterModal: React.FC<CompetitionProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()

  return (
    <Modal title="Collect Winnings" onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" maxWidth="400px">
        <span>wat</span>
      </Flex>
      <Button variant="text" onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Modal>
  )
}

export default RegisterModal
