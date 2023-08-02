import { useTranslation } from '@pancakeswap/localization'
import { Box, Message, MessageText, Text, useToast } from '@pancakeswap/uikit'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { DappClient } from '@walletconnect/push-client'
import PushSubscriptionButton from '../components/PushSubscribeButton/PushSubscribeButton'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { ScrollableContainer } from '../styles'

interface ISettingsProps {
  pushClient: DappClient
  chainId: number
  account: string
  isSubscribing: boolean
  setIsSubscribing: Dispatch<SetStateAction<boolean>>
  isSubscribed: boolean
  setIsSubscribed: Dispatch<SetStateAction<boolean>>
  // account: string
}

const NotificationSettingsMain = ({
  pushClient,
  chainId,
  account,
  isSubscribing,
  setIsSubscribing,
  isSubscribed,
  setIsSubscribed,
}: ISettingsProps) => {
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false)

  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      // Resolve known pairings from the Core's Pairing API.
      const pairings = pushClient.core.pairing.getPairings()
      if (!pairings?.length) {
        throw new Error('No pairings found')
      }

      const latestPairing = pairings[pairings.length - 1]
      if (!latestPairing?.topic) {
        throw new Error('Subscription failed', {
          cause: 'pairingTopic is missing',
        })
      }
      const { id } = await pushClient.propose({
        account: `eip155:${chainId}:${account}`,
        pairingTopic: latestPairing.topic,
      })

      if (!id) {
        throw new Error('Subscription request failed', {
          cause: 'Push propose failed',
        })
      }
      toastSuccess(
        `${t('Subscription Request')}!`,
        <Text>{t('The subscription request has been sent to your wallet')}</Text>,
      )
    } catch (error) {
      setIsSubscribing(false)
      if (error instanceof Error) {
        toastError(`${t('Subscription Request eError')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [pushClient, account, toastSuccess, toastError, t, chainId, setIsSubscribing])

  const handleUnSubscribe = useCallback(async () => {
    setIsUnsubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      const pushSubscriptions = pushClient.getActiveSubscriptions()
      const currentSubscription = Object.values(pushSubscriptions).find(
        (sub) => sub.account === `eip155:${chainId}:${account}`,
      )

      if (currentSubscription) {
        const unsubscribeRawRes = await fetch('http://localhost:8000/delete-user', {
          method: 'POST',
          body: JSON.stringify({
            account,
          }),
          headers: {
            'content-type': 'application/json',
          },
        })
        const unsubscribeRes = await unsubscribeRawRes.json()
        const isSuccess = unsubscribeRes.success
        if (!isSuccess) {
          throw new Error('Failed to unsubscribe!')
        }
        await pushClient.deleteSubscription({
          topic: currentSubscription.topic,
        })

        setIsUnsubscribing(false)
        setIsSubscribed(false)
        toastSuccess(`${t('Unsubscribed')}!`, <Text>{t('You unsubscribed from gm notification')}</Text>)
      }
    } catch (error) {
      setIsUnsubscribing(false)
      console.error({ unsubscribeError: error })
      if (error instanceof Error) {
        toastError(`${t('Subscription Request eError')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [setIsSubscribed, pushClient, account, toastSuccess, toastError, t, chainId])

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
        <SettingsContainer account={account} isSubscribed={isSubscribed} />
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
