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
  const fetchTxs = useCallback(
    async () => {
      console.log('heyyyyyy')
      try {
        const response = await fetch(`http://localhost:8000/users?account=0x2dC45bA781E8B9D12501bd14d01f072bA4Df1481`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        const result = response.json() as any
        // console.log(transacxtionsResponse);
        // const cache: any = {};
        // cache[account] = x.userNotifications;
        // sessionStorage.setItem('user-transactions', JSON.stringify(cache));
        // setTransactions(result.userNotifications);
      } catch (err) {
        //  setError("notifications.somethingWentWrongTryLater");
        console.log(err)
      }
    },
    [
      // account,
      // setTransactions,
    ],
  )

  useEffect(() => {
    fetchTxs()
  }, [fetchTxs])

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column">
          {/* <StyledSwapContainer $isChartExpanded={false}>
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
          </StyledSwapContainer> */}
        </Flex>
      </Flex>
    </Page>
  )
}
