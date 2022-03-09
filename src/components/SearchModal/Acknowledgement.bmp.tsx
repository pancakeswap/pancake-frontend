import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, Checkbox, Button, Message, Box } from '@pancakeswap/uikit'
import { enableList } from '../../state/lists/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch, AppState } from '../../state'
import { CurrencyModalView } from './types'
import styled from 'styled-components'

interface AcknowledgementProps {
  listUrl: string
  setModalView: (view: CurrencyModalView) => void
}

const MessageContainer = styled(Message)`
  align-items: flex-start;
  justify-content: flex-start;
`

const Acknowledgement: React.FC<AcknowledgementProps> = ({ listURL, setModalView }) => {
  const { t } = useTranslation()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Box>
      <MessageContainer variant="warning" mb="24px">
        <Text>{t('mp-confirm-enable-list')}</Text>
      </MessageContainer>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Checkbox
            name="confirmed"
            type="checkbox"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            scale="sm"
          />
          <Text ml="10px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>

        <Button
          disabled={!isConfirmed}
          onClick={() => {
            dispatch(enableList(listURL))
            setModalView(CurrencyModalView.manage)
          }}
        >
          {t('Activate')}
        </Button>
      </Flex>
    </Box>
  )
}

export default Acknowledgement
