import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, useToast } from '@pancakeswap/uikit'
import { PushClientTypes, WalletClient } from '@walletconnect/push-client'
import _isEqual from 'lodash/isEqual'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import PushSubscriptionButton from '../components/PushSubscribeButton/PushSubscribeButton'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { SubscriptionState } from '../index'
import { ScrollableContainer } from '../styles'

interface ISettingsProps {
  pushClient: WalletClient
  chainId: number
  account: string
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
  activeSubscriptions: PushClientTypes.PushSubscription[],
}

const NotificationSettingsMain = ({
  pushClient,
  chainId,
  account,
 setSubscriptionState,
 subscriptionState,
 activeSubscriptions
}: ISettingsProps) => {

  const { toastError } = useToast()
  const { t } = useTranslation()
  const [scopes, setScopes] = useState<PushClientTypes.PushSubscription['scope']>({})
  const prevScopesRef = useRef<PushClientTypes.PushSubscription['scope']>(scopes);

  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current);

  // Reduces the scopes mapping to only an array of enabled scopes
  const getEnabledScopes = (scopesMap: PushClientTypes.PushSubscription['scope']) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if (scope.enabled) {
        enabledScopeKeys.push(key)
      }
    })

    return enabledScopeKeys
  }

  useEffect(() => {
    const app = activeSubscriptions.find(sub => sub.account === `eip155:${chainId}:${account}`)
    if (!app) {
      return
    }
    setScopes(app.scope)
    prevScopesRef.current = app.scope
  }, [activeSubscriptions, account, chainId])

  const handleUpdatePreferences = useCallback(async () => {
    const { topic } = activeSubscriptions.find(sub => sub.account === `eip155:${chainId}:${account}`)
    if (pushClient && topic) {
      try {
        // @ts-ignore
        pushClient?.emit('push_update', {})
        await pushClient.update({
          topic,
          scope: getEnabledScopes(scopes)
        })
        const newScope = activeSubscriptions.find(sub => sub.account === `eip155:${chainId}:${account}`)
        prevScopesRef.current = newScope?.scope
      } catch (error) {
        console.error(error)
      }
    }
  }, [pushClient, scopes, account, activeSubscriptions, chainId])

  const handleUnSubscribe = useCallback(
    async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: true}))
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

        setSubscriptionState((prevState) => ({ ...prevState, isOnboarding: false, isSubscribed: false, isUnsubscribing: false}))
        // @ts-ignore
        pushClient.emit('push_delete', { })
      }
    } catch (error) {
      setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: false}))

      if (error instanceof Error) {
        toastError(`${t('Something went wrong')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [setSubscriptionState, pushClient, account, toastError, t, chainId])

  return (
    <Box paddingX="24px" paddingBottom="24px">
      <ScrollableContainer>
        <SettingsContainer account={account} scopes={scopes} setScopes={setScopes} />
        <Box>
          <PushSubscriptionButton
            isUnsubscribing={subscriptionState.isUnsubscribing}
            handleSubscriptionAction={objectsAreEqual ? handleUnSubscribe : handleUpdatePreferences}
            objectsAreEqual={objectsAreEqual}
          />
        </Box>
      </ScrollableContainer>
    </Box>
  )
}

export default NotificationSettingsMain
