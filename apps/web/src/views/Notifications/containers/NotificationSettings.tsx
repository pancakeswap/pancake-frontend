import { useTranslation } from '@pancakeswap/localization'
import { Box, Message, MessageText } from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { Connector } from 'wagmi'
import PushSubscriptionButton from '../components/PushSubscribeButton/PushSubscribeButton'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { ScrollableContainer } from '../styles'

interface ISettingsProps {
  account: string
  handleSubscribe: () => Promise<void>
  handleUnSubscribe: () => Promise<void>
  isSubscribed: boolean
  isUnsubscribing: boolean
  isSubscribing: boolean
  connector: Connector<any, any>
}

const NotificationSettingsMain = ({
  handleSubscribe,
  handleUnSubscribe,
  isSubscribed,
  isSubscribing,
  isUnsubscribing,
}: ISettingsProps) => {
  const { t } = useTranslation()

  const handleSubscriptionAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      return isSubscribed ? handleUnSubscribe() : handleSubscribe()
    },
    [handleSubscribe, handleUnSubscribe, isSubscribed],
  )

  return (
    <Box paddingX="24px" paddingBottom="24px">
      <ScrollableContainer>
        <SettingsContainer />
        <Box>
          {!isSubscribed ? (
            <Message mb="16px" variant="warning" padding="8px">
              <MessageText>{t('Please sign again to apprve changes in wallet!')} </MessageText>
            </Message>
          ) : null}
          <PushSubscriptionButton
            isSubscribed={isSubscribed}
            isSubscribing={isSubscribing}
            isUnsubscribing={isUnsubscribing}
            handleSubscriptionAction={handleSubscriptionAction}
          />
        </Box>
      </ScrollableContainer>
    </Box>
  )
}

export default NotificationSettingsMain
