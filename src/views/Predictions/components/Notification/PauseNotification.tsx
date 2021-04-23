import React from 'react'
import { Box, Button, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import Notification from './Notification'

const PauseNotification = () => {
  const TranslateString = useI18n()
  const dispatch = useAppDispatch()

  const handleOpenHistory = () => {
    dispatch(setHistoryPaneState(true))
  }

  return (
    <Notification title={TranslateString(999, 'Markets Paused')}>
      <Box mb="24px">
        <Text as="p">{TranslateString(999, 'Prediction markets have been paused due to an error.')}</Text>
        <Text as="p">{TranslateString(999, 'All open positions have been cancelled.')}</Text>
        <Text as="p">
          {TranslateString(
            999,
            'You can reclaim any funds entered into existing positions via the History tab on this page.',
          )}
        </Text>
      </Box>
      <Button variant="primary" width="100%" onClick={handleOpenHistory}>
        {TranslateString(999, 'Show History')}
      </Button>
    </Notification>
  )
}

export default PauseNotification
