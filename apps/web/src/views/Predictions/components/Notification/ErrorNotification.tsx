import { Button, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { setHistoryPaneState } from 'state/predictions'
import { useCallback } from 'react'
import Notification from './Notification'

const ErrorNotification = () => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()

  const handleOpenHistory = useCallback(() => {
    dispatch(setHistoryPaneState(true))
  }, [dispatch])

  return (
    <Notification title={t('Error')}>
      <Text as="p" mb="24px">
        {t('This page can’t be displayed right now due to an error. Please check back soon.')}
      </Text>
      <Button variant="primary" width="100%" onClick={handleOpenHistory}>
        {t('Show History')}
      </Button>
    </Notification>
  )
}

export default ErrorNotification
