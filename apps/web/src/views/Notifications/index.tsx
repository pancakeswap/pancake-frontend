import { Flex, Text, useToast } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useCallback, useEffect, useState } from 'react'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import { useTranslation } from '@pancakeswap/localization'
import Page from '../Page'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../Swap/styles'
import { NotificationView } from './types'
import NotificationSettingsMain from './containers/NotificationSettings'
import SubscribedView from './containers/OnBoardingView'

export default function Notifications() {
  const { connector, account, pushClient } = useWalletConnectPushClient()
  const [modalView, setModalView] = useState<NotificationView>(NotificationView.onBoarding)
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [enabled, setEnabled] = useState<boolean>(true)

  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const handleSubscribed = useCallback(() => {
    localStorage.setItem('subscribed', 'true')
    setEnabled(true)
    setModalView(NotificationView.Settings)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('subscribed')) {
      if (localStorage.getItem('enabled')) setModalView(NotificationView.Settings)
    } else setEnabled(false)
  }, [])

  useEffect(() => {
    if (pushClient) {
      const activeSubscriptions = pushClient?.getActiveSubscriptions()
      if (Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:1:${account}`)) {
        setIsSubscribed(true)
      }
    }
  }, [pushClient, account])

  useEffect(() => {
    if (!pushClient) {
      return
    }
    pushClient.on('push_response', (event) => {
      if (event.params.error) {
        setIsSubscribed(false)
        setIsSubscribing(false)
        toastError(`${t('Error on `push_response')}!`, <Text>{t(`${event.params.error.message}`)}</Text>)
      } else {
        setIsSubscribed(true)
        setIsSubscribing(false)

        if (!localStorage.getItem('enabled')) {
          setEnabled(false)
          localStorage.setItem('enabled', 'true')
          setModalView(NotificationView.Notifications)
        }
        toastSuccess(
          `${t('Established PushSubscription')}!`,
          <Text>{t(`${event.params.subscription?.account} successfully subscribed`)}</Text>,
        )
      }
    })

    pushClient.on('push_delete', (event) => {
      setIsSubscribed(false)
      setIsSubscribing(false)
      toastSuccess(
        `${t('Deleted PushSubscription')}!`,
        <Text>{t(`Deleted PushSubscription on topic ${event.topic}`)}</Text>,
      )
    })
  }, [toastError, toastSuccess, account, pushClient, t])

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      // Resolve known pairings from the Core's Pairing API.
      // console.log(p)
      const pairings = pushClient.core.pairing.getPairings()
      if (!pairings?.length) {
        throw new Error('No pairings found')
      }
      // Use the latest pairing.
      const latestPairing = pairings[pairings.length - 1]
      if (!latestPairing?.topic) {
        throw new Error('Subscription failed', {
          cause: 'pairingTopic is missing',
        })
      }
      const { id } = await pushClient.propose({
        account: `eip155:1:${account}`,
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
  }, [pushClient, account, toastSuccess, toastError, t])

  const handleUnSubscribe = useCallback(async () => {
    setIsUnsubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      const pushSubscriptions = pushClient.getActiveSubscriptions()
      const currentSubscription = Object.values(pushSubscriptions).find((sub) => sub.account === `eip155:1:${account}`)

      if (currentSubscription) {
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
  }, [setIsSubscribed, pushClient, account, toastSuccess, toastError, t])

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper>
              <AppBody>
                {modalView === NotificationView.onBoarding ? (
                  <SubscribedView handleSubscribed={handleSubscribed} />
                ) : null}
                {modalView === NotificationView.Notifications && account ? (
                  // <SettingsModal setModalView={setModalView} enabled={enabled} />
                  <></>
                ) : null}
                {modalView === NotificationView.Settings && account ? (
                  <NotificationSettingsMain
                    connector={connector}
                    handleSubscribe={handleSubscribe}
                    handleUnSubscribe={handleUnSubscribe}
                    isSubscribed={isSubscribed}
                    isSubscribing={isSubscribing}
                    isUnsubscribing={isUnsubscribing}
                    account={account}
                  />
                ) : null}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
