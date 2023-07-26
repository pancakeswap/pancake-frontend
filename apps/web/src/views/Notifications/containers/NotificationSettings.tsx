import { useTranslation } from '@pancakeswap/localization'
import { Box, Message, MessageText } from '@pancakeswap/uikit'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Connector } from 'wagmi'
import NotificationHeader from '../components/Notificationheader/Notificationheader'
import PushSubscriptionButton from '../components/PushSubscribeButton/PushSubscribeButton'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { ScrollableContainer } from '../styles'
import { NotificationView } from '../types'

interface ISettingsProps {
  setModalView: Dispatch<SetStateAction<NotificationView>>
  account: string
  handleSubscribe: () => Promise<void>
  handleUnSubscribe: () => Promise<void>
  isSubscribed: boolean
  isUnsubscribing: boolean
  isSubscribing: boolean
  connector: Connector<any, any>
  enabled: boolean
}

const NotificationSettingsMain = ({
  setModalView,
  handleSubscribe,
  handleUnSubscribe,
  isSubscribed,
  isSubscribing,
  isUnsubscribing,
  enabled,
}: ISettingsProps) => {
  const { t } = useTranslation()

  const onBack = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setModalView(NotificationView.Notifications)
    },
    [setModalView],
  )

  const handleSubscriptionAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      return isSubscribed ? handleUnSubscribe() : handleSubscribe()
    },
    [handleSubscribe, handleUnSubscribe, isSubscribed],
  )

  return (
    <>
      <NotificationHeader onBack={onBack} onDismiss={() => null} isEnabled={enabled} />
      <Box paddingX="24px" paddingBottom="24px">
        <ScrollableContainer>
          <SettingsContainer />
          <Box>
            <Message mb="16px" variant="warning" padding="8px">
              <MessageText>{t('Please sign again to apprve changes in wallet!')} </MessageText>
            </Message>
            <PushSubscriptionButton
              isSubscribed={isSubscribed}
              isSubscribing={isSubscribing}
              isUnsubscribing={isUnsubscribing}
              handleSubscriptionAction={handleSubscriptionAction}
            />
          </Box>
        </ScrollableContainer>
      </Box>
    </>
  )
}

export default NotificationSettingsMain
