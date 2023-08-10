import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import { CommitButton } from 'components/CommitButton'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import _isEqual from 'lodash/isEqual'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { Events } from '../constants'
import { ScrollableContainer } from '../styles'
import { PushDeleteEmitter, PushResponseEmitter, SubscriptionState } from '../types'

interface PushSubButtonProps {
  isUnsubscribing: boolean
  handleSubscriptionAction: (e: React.MouseEvent<HTMLButtonElement>) => void
  objectsAreEqual: boolean
}

function NotificationActionButton({ isUnsubscribing, handleSubscriptionAction, objectsAreEqual }: PushSubButtonProps) {
  const { t } = useTranslation()

  let buttonText: string = t('UnSubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('UnSubscribing') : t('UnSubscribe')
  } else buttonText = isUnsubscribing ? t('Updating') : t('Update Preferences')

  return (
    <AutoColumn gap="md" marginTop="6px">
      <CommitButton variant="primary" onClick={handleSubscriptionAction} isLoading={isUnsubscribing} height="50px">
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {buttonText}
          </Text>
          {isUnsubscribing ? <CircleLoader stroke="white" /> : null}
        </Flex>
      </CommitButton>
    </AutoColumn>
  )
}

interface ISettingsProps {
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
}

const NotificationSettingsMain = ({ setSubscriptionState, subscriptionState }: ISettingsProps) => {
  const { toastError, toastSuccess } = useToast()
  const { pushClient, currentSubscription } = useWalletConnectPushClient()
  const [scopes, setScopes] = useState<PushClientTypes.PushSubscription['scope']>({})
  const prevScopesRef = useRef<PushClientTypes.PushSubscription['scope']>(scopes)
  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current)

  const getEnabledScopes = (scopesMap: PushClientTypes.PushSubscription['scope']) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if (scope.enabled) enabledScopeKeys.push(key)
    })
    return enabledScopeKeys
  }

  useEffect(() => {
    if (!currentSubscription.scope) return
    setScopes(currentSubscription.scope)
    prevScopesRef.current = currentSubscription.scope
  }, [currentSubscription.scope])

  const handleUpdatePreferences = useCallback(async () => {
    if (pushClient || currentSubscription.topic) {
      try {
        pushClient?.emit('push_update', {} as PushResponseEmitter)
        await pushClient.update({
          topic: currentSubscription.topic,
          scope: getEnabledScopes(scopes),
        })
        const newScope = currentSubscription
        prevScopesRef.current = newScope?.scope
        toastSuccess(Events.PreferencesUpdated.title, Events.PreferencesUpdated.message)
      } catch (error: any) {
        toastError(Events.PreferencesError.title, Events.PreferencesError.message)
      }
    }
  }, [pushClient, scopes, currentSubscription, toastError, toastSuccess])

  const handleUnSubscribe = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: true }))
      try {
        if (currentSubscription.topic) {
          await pushClient.deleteSubscription({ topic: currentSubscription.topic })
          setSubscriptionState((prevState) => ({
            ...prevState,
            isOnboarding: false,
            isSubscribed: false,
            isUnsubscribing: false,
          }))
          pushClient.emit('push_delete', {} as PushDeleteEmitter)
        }
      } catch (error: any) {
        setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: false }))
        toastError(Events.UnsubscribeError.title, Events.UnsubscribeError.message)
      }
    },
    [setSubscriptionState, pushClient, currentSubscription.topic, toastError],
  )

  return (
    <Box paddingBottom="24px">
      <ScrollableContainer>
        <SettingsContainer scopes={scopes} setScopes={setScopes} />
        <Box paddingX="24px">
          <NotificationActionButton
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
