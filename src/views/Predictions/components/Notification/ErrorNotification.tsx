import React from 'react'
import { Button, Text } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { setHistoryPaneState } from 'state/predictions'
import Notification from './Notification'

const ErrorNotification = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleOpenHistory = () => {
    dispatch(setHistoryPaneState(true))
  }
  return (
    <Notification title={t('Error')}>
      <Text as="p" mb="24px">
        {t("This page can't be displayed right now due to an error. Please check back soon.")}
      </Text>
      <Button variant="primary" width="100%" onClick={handleOpenHistory}>
        {t('Show History')}
      </Button>
    </Notification>
  )
}

export default ErrorNotification
