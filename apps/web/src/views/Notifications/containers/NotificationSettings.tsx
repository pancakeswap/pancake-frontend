import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { PushClientTypes } from '@walletconnect/push-client'
import { CommitButton } from 'components/CommitButton'
import _isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PushClient } from 'state/PushClientProxy'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { Events } from '../constants'
import { ScrollableContainer } from '../styles'

interface ISettingsProps {
  currentSubscription: PushClientTypes.PushSubscription
  pushClient: PushClient
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

const NotificationSettingsMain = ({ pushClient, currentSubscription }: ISettingsProps) => {
  const [loading, setloading] = useState<boolean>(false)
  const [scopes, setScopes] = useState<PushClientTypes.PushSubscription['scope']>({})

  const toast = useToast()
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
    if (!currentSubscription?.scope) return
    setScopes(currentSubscription?.scope)
    prevScopesRef.current = currentSubscription?.scope
  }, [currentSubscription?.scope])

  const handleUpdatePreferences = useCallback(async () => {
    try {
      pushClient?.emitter.on('push_update', () => {
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
      await pushClient.deleteSubscription({ topic: currentSubscription?.topic })
      pushClient?.emitter.on('push_delete', () => {
        toast.toastSuccess(Events.PreferencesUpdated.title, Events.PreferencesUpdated.message)
      })
    } catch (error: any) {
      toast.toastError(Events.UnsubscribeError.title, Events.UnsubscribeError.message)
    }
    setloading(false)
  }, [pushClient, currentSubscription?.topic, toast])

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
