import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, useToast } from '@pancakeswap/uikit'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import SubscribedView from 'views/Notifications/containers/OnBoardingView'
import { useChainId } from 'wagmi'
import SettingsModal from '../../containers/NotificationView'
import { StyledInputCurrencyWrapper } from '../../styles'
import NotificationHeader from '../Notificationheader/Notificationheader'
import NotificationMenu from './NotificationMenu'

const ViewContainer = styled.div<{ isRightView: boolean }>`
  display: flex;
  width: 200%;
  transition: transform 300ms ease-in-out;
  transform: translateX(${({ isRightView }) => (isRightView ? '0%' : '-50%')});
`

const View = styled.div`
  // flex: 1;
  // width: 50%;
  width: 100%;
`

export const NOTIFICATION_BODY = `your share is 000000018% and you will recieve approximately 0.0000000000578269 CAKE2-tBNB LP`

export const NotificationDropdown = () => {
  const { connector, account, pushClient, testSendTransaction } = useWalletConnectPushClient()
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [enabled, setEnabled] = useState<boolean>(true)
  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const chainId = useChainId()

  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()

  const handleSubscribed = useCallback(() => {
    localStorage.setItem('subscribed', 'true')
    setEnabled(true)
    setIsRightView(false)
  }, [])

  useEffect(() => {
    if (localStorage.getItem('subscribed')) {
      if (localStorage.getItem('enabled')) setIsRightView(false)
    } else setEnabled(false)
  }, [])

  useEffect(() => {
    if (pushClient) {
      const activeSubscriptions = pushClient?.getActiveSubscriptions()
      if (Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:${chainId}:${account}`)) {
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
          setIsRightView(true)
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
  }, [pushClient, account, toastSuccess, toastError, t, chainId])

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

  const handleSendTestNotification = useCallback(async () => {
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      const notificationPayload = {
        accounts: [`eip155:${chainId}:${account}`],
        notification: {
          title: 'New Liquidity Position added',
          body: NOTIFICATION_BODY,
          // href already contains the trailing slash
          icon: `${window.location.href}logo.png`,
          url: 'https://web-git-feat-web3-notifications.pancake.run',
          type: 'alerts',
        },
      }

      const result = await fetch(`https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${'1841eeb4-4bc7-4e76-8f68-f1638e05d09f'}`,
        },
        body: JSON.stringify(notificationPayload),
      })

      const gmRes = await result.json() // { "sent": ["eip155:${chainId}:0xafeb..."], "failed": [], "not_found": [] }
      console.log(gmRes)

      const isSuccessfulGm = gmRes.sent.includes(notificationPayload.accounts[0])

      if (isSuccessfulGm)
        toastSuccess(
          `${t('Notification Sent to wallet')}!`,
          <Text>{t('Check your mobile wallet to seee ypur most recent notifications')}</Text>,
        )
    } catch (error) {
      console.error({ sendGmError: error })
      if (error instanceof Error) {
        toastError(`${t('Notification Failed')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [toastSuccess, toastError, account, pushClient, t, chainId])

  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isRightView) setIsRightView(false)
      else setIsRightView(true)
    },
    [setIsRightView, isRightView],
  )

  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])

  const fetchTxs = useCallback(async () => {
    try {
      const transactionsResponse = await fetch(`http://localhost:8000/users?account=${account}`)
      if (!transactionsResponse) return
      const res = await transactionsResponse.json()
      console.log(res)
      const cache: any = {}
      cache[account] = res.userNotifications
      sessionStorage.setItem('user-transactions', JSON.stringify(cache))
      setTransactions(res.userNotifications)
    } catch (err) {
      //  setError("notifications.somethingWentWrongTryLater");
    }
  }, [account, setTransactions])

  useEffect(() => {
    fetchTxs()
    const intervalId: NodeJS.Timer = setInterval(fetchTxs, 30000)
    return () => clearInterval(intervalId)
  }, [account, fetchTxs])

  useEffect(() => {
    const txns = sessionStorage.getItem('user-transactions')
    if (account && txns) {
      const cache = JSON.parse(txns)
      if (Object.keys(cache).length > 0 && cache[account] && cache[account].length > 0) {
        setTransactions(cache[account])
        //  setError(null);
      }
    }
  }, [account, setTransactions])

  return (
    <NotificationMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} mr="8px">
      {() => (
        <>
          {/* {!isSubscribed ? ( */}
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isEnabled={enabled}
            isSettings={!isRightView}
          />
          <Button onClick={handleSendTestNotification}>dgs</Button>
          {/* ) : null} */}
          <StyledInputCurrencyWrapper>
            {!isSubscribed && !enabled ? (
              <SubscribedView handleSubscribed={handleSubscribed} />
            ) : (
              <ViewContainer isRightView={isRightView}>
                <View>
                  {account && <SettingsModal transactions={transactions} account={account} fetchTxs={fetchTxs} />}
                </View>
                <View>
                  {account && (
                    <NotificationSettingsMain
                      connector={connector}
                      handleSubscribe={handleSubscribe}
                      handleUnSubscribe={handleUnSubscribe}
                      isSubscribed={isSubscribed}
                      isSubscribing={isSubscribing}
                      isUnsubscribing={isUnsubscribing}
                      account={account}
                    />
                  )}
                </View>
              </ViewContainer>
            )}
          </StyledInputCurrencyWrapper>
        </>
      )}
    </NotificationMenu>
  )
}
