import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { CommitButton } from 'components/CommitButton'
import _isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PushClient } from 'PushNotificationClient'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { Events } from '../constants'
import { ScrollableContainer } from '../styles'

interface ISettingsProps {
  currentSubscription: NotifyClientTypes.NotifySubscription
  pushClient: PushClient
  refreshNotifications: () => void
}

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
  } else buttonText = isUnsubscribing ? t('Updating...') : t('Update Preferences')

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

const NotificationSettingsMain = ({ pushClient, currentSubscription, refreshNotifications }: ISettingsProps) => {
  const [loading, setloading] = useState<boolean>(false)
  const [scopes, setScopes] = useState<NotifyClientTypes.NotifySubscription['scope']>({})

  const toast = useToast()
  const prevScopesRef = useRef<NotifyClientTypes.NotifySubscription['scope']>(scopes)
  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current)

  const getEnabledScopes = (scopesMap: NotifyClientTypes.NotifySubscription['scope']) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if (scope.enabled) enabledScopeKeys.push(key)
    })
    return enabledScopeKeys
  }

  useEffect(() => {
    if (!currentSubscription?.scope) return
    setScopes(currentSubscription?.scope)
    prevScopesRef.current = currentSubscription?.scope
  }, [currentSubscription?.scope])

  const handleUpdatePreferences = useCallback(async () => {
    try {
      pushClient?.emitter.on('notify_update', () => {
        toast.toastSuccess(Events.PreferencesUpdated.title, Events.PreferencesUpdated.message)
      })
      await pushClient.update({
        topic: currentSubscription?.topic,
        scope: getEnabledScopes(scopes),
      })
      const newScope = currentSubscription
      prevScopesRef.current = newScope.scope
    } catch (error: any) {
      toast.toastError(Events.PreferencesError.title, Events.PreferencesError.message)
    }
  }, [pushClient, scopes, currentSubscription, toast])

  const handleUnSubscribe = useCallback(async () => {
    setloading(true)
    try {
      pushClient.emitter.on('notify_delete', () => {
        refreshNotifications()
        toast.toastSuccess(Events.PreferencesUpdated.title, Events.PreferencesUpdated.message)
      })
      await pushClient.deleteSubscription({ topic: currentSubscription?.topic })
    } catch (error: any) {
      toast.toastError(Events.UnsubscribeError.title, Events.UnsubscribeError.message)
    }
    setloading(false)
  }, [pushClient, currentSubscription?.topic, toast, refreshNotifications])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (objectsAreEqual) handleUnSubscribe()
      else handleUpdatePreferences()
    },
    [handleUpdatePreferences, handleUnSubscribe, objectsAreEqual],
  )

  return (
    <Box paddingBottom="24px" width="100%">
      <ScrollableContainer>
        <SettingsContainer scopes={scopes} setScopes={setScopes} />
        <Box paddingX="24px">
          <NotificationActionButton
            isUnsubscribing={loading}
            handleSubscriptionAction={handleAction}
            objectsAreEqual={objectsAreEqual}
          />
        </Box>
      </ScrollableContainer>
    </Box>
  )
}

export default NotificationSettingsMain
