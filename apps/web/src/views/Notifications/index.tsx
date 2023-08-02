import { useTranslation } from '@pancakeswap/localization'
import { Text, useToast } from '@pancakeswap/uikit'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import { useCallback, useEffect, useState } from 'react'
import NotificationSettingsMain from 'views/Notifications/containers/NotificationSettings'
import SubscribedView from 'views/Notifications/containers/OnBoardingView'
import { useChainId } from 'wagmi'
import { useActiveNotifications } from '@pancakeswap/utils/user'
import SettingsModal from './containers/NotificationView'
import { StyledInputCurrencyWrapper, ViewContainer, View } from './styles'
import NotificationHeader from './components/Notificationheader/Notificationheader'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'

export const NOTIFICATION_BODY = `your share is 000000018% and you will recieve approximately 0.0000000000578269 CAKE2-tBNB LP`

const Notifications = () => {
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [enabled, setEnabled] = useState<boolean>(true)
  const [isOnboarding, setIsOnBoarding] = useState<boolean>(true)
  const [isRightView, setIsRightView] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<any[]>([])
 

  const { account, pushClient } = useWalletConnectPushClient()
  const { notifications } = useActiveNotifications()
  const { toastSuccess, toastError } = useToast()

  const { t } = useTranslation()
  const chainId = useChainId()

  const handleEnableNotifications = useCallback(() => {
    localStorage.setItem('enabled', 'true')
    setEnabled(true)
    setIsRightView(false)
  }, [])

  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (isRightView) setIsRightView(false)
      else setIsRightView(true)
    },
    [setIsRightView, isRightView],
  )

  const fetchTxs = useCallback(async () => {
    try {
      const transactionsResponse = await fetch(`http://localhost:8000/get-users-notifications?account=${account}`)
      if (!transactionsResponse) return
      const res = await transactionsResponse.json()
      setTransactions(res.userNotifications)
    } catch (err) {
      console.error(err)
    }
  }, [account, setTransactions])

  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])

  const SendTestOnboardNotification = useCallback(async () => {
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }

      const notificationPayload2 = {
        accounts: [`eip155:${chainId}:${account}`],
        notification: {
          title: 'Welcome',
          body: 'You have successfully joined Pancake Notifications Yaaaay!',
          icon: `${window.location.href}logo.png`,
          url: 'https://pc-custom-web.vercel.app',
          type: 'alerts',
        },
      }

      const result = await fetch(`https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
        },
        body: JSON.stringify(notificationPayload2),
      })

      const gmRes = await result.json() // { "sent": ["eip155:${chainId}:0xafeb..."], "failed": [], "not_found": [] }
      const isSuccessfulGm = gmRes.sent.includes(notificationPayload2.accounts[0])

      if (isSuccessfulGm)
        toastSuccess(
          `${t('Notification Sent to wallet')}!`,
          <Text>{t('Check your mobile wallet to seee ypur most recent notifications')}</Text>,
        )
    } catch (error) {
      // setIsSendingTestNoti(false);
      console.error({ sendGmError: error })
      if (error instanceof Error) {
        toastError(`${t('Notification Failed')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [toastSuccess, toastError, account, pushClient, t, chainId])

  useEffect(() => {
    if (!localStorage.getItem('enabled')) setEnabled(false)
    if (localStorage.getItem('onboarding')) setIsOnBoarding(false)
  }, [])

  useEffect(() => {
    if (!account || !isMenuOpen) return
    fetchTxs()
  }, [account, fetchTxs, isMenuOpen])

  useEffect(() => {
    if (!pushClient) {
      return
    }
    const activeSubscriptions = pushClient?.getActiveSubscriptions()
    if (Object.values(activeSubscriptions).some((sub) => sub.account === `eip155:${chainId}:${account}`)) {
      setIsSubscribed(true)
    }
    pushClient.on('push_response', (event) => {
      if (event.params.error) {
        setIsSubscribing(false)
        toastError(`${t('Error on `push_response')}!`, <Text>{t(`${event.params.error.message}`)}</Text>)
      } else {
        fetch("http://localhost:8000/subscribe", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            account,
            liquidity: notifications.LiquidityNotifications,
            staking: notifications.StakingNotifications,
            pools: notifications.PoolNotifications,
            farms: notifications.FarmNotifications
          }),
        })
          .then(async (data) => data.json())
          .then((data) => {
            if (data.success) {
              setIsSubscribed(true);
              setIsSubscribing(false);
            
              toastSuccess(
                `${t('Established PushSubscription')}!`,
                <Text>{t(`${event.params.subscription?.account} successfully subscribed`)}</Text>,
              )
              if (!localStorage.getItem('onboarding')) {
                localStorage.setItem('onboarding', 'true')
                setIsOnBoarding(false)
                setIsRightView(true)
              }

              setTimeout(() => SendTestOnboardNotification(), 5000)
            } else {
              throw new Error(data.message);
            }
          })
          .catch((e) => {
            setIsSubscribed(false);
            setIsSubscribing(false);
            toastError(
              `${t('Something went wrong')}!`,
              <Text>{t(`${e.message}`)}</Text>,
            )
          });
      }
    })

    pushClient.on('push_delete', (event) => {
      setIsSubscribed(false)
      toastSuccess(
        `${t('Deleted PushSubscription')}!`,
        <Text>{t(`Deleted PushSubscription on topic ${event.topic}`)}</Text>,
      )
    })
  }, [toastError, toastSuccess, account, pushClient, t, chainId, SendTestOnboardNotification])

  // useEffect(() => {
  //   if (positions?.length) {
  //     const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
  //       (acc, p) => {
  //         acc[p.liquidity === 0n ? 1 : 0].push(p)
  //         return acc
  //       },
  //       [[], []],
  //     ) ?? [[], []]
  
  //     const filteredPositions = [...(closedPositions)]
  
  //     console.log(filteredPositions)

  // }, [])

  return (
    <NotificationMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} mr="8px">
      {() => (
        <>
          <NotificationHeader
            onBack={toggleSettings}
            onDismiss={onDismiss}
            isSubscribed={isOnboarding}
            isSettings={!isRightView}
          />
          <StyledInputCurrencyWrapper>
            {!enabled ? (
              <SubscribedView handleSubscribed={handleEnableNotifications} />
            ) : (
              <ViewContainer isRightView={isOnboarding ? false : isRightView}>
                <View>
                  <SettingsModal transactions={transactions} account={account} fetchTxs={fetchTxs} />
                </View>
                <View>
                
                    <NotificationSettingsMain
                      pushClient={pushClient}
                      chainId={chainId}
                      account={account}
                      isSubscribing={isSubscribing}
                      isSubscribed={isSubscribed}
                      setIsSubscribed={setIsSubscribed}
                      setIsSubscribing={setIsSubscribing}
                      // account={account}
                    />
                 
                </View>
              </ViewContainer>
            )}
          </StyledInputCurrencyWrapper>
        </>
      )}
    </NotificationMenu>
  )
}

export default Notifications
