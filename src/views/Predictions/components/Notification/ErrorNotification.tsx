import React from 'react'
import { Button, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import Notification from './Notification'

const ErrorNotification = () => {
  const TranslateString = useI18n()
  const dispatch = useAppDispatch()

  const handleOpenHistory = () => {
    dispatch(setHistoryPaneState(true))
  }
  return (
    <Notification title={TranslateString(999, 'Error')}>
      <Text as="p" mb="24px">
        {TranslateString(999, 'An error occurred. Blame someone else')}
      </Text>
      <Button variant="primary" width="100%" onClick={handleOpenHistory}>
        {TranslateString(999, 'Show History')}
      </Button>
    </Notification>
  )
}

export default ErrorNotification
