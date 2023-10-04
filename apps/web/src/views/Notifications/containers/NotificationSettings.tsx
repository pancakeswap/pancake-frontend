import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import _isEqual from 'lodash/isEqual'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useManageSubscription, useSubscriptionScopes } from '@web3inbox/widget-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { Events } from '../constants'
import { ScrollableContainer } from '../styles'
import { getSettingsButtonText } from '../utils/textHelpers'

interface PushSubButtonProps {
  isUnsubscribing: boolean
  handleSubscriptionAction: (e: React.MouseEvent<HTMLButtonElement>) => void
  objectsAreEqual: boolean
}

function NotificationActionButton({ isUnsubscribing, handleSubscriptionAction, objectsAreEqual }: PushSubButtonProps) {
  const { t } = useTranslation()
  const buttonText = getSettingsButtonText(isUnsubscribing, objectsAreEqual, t)

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

const NotificationSettingsMain = ({ account }: { account: string | undefined }) => {
  const [loading, setloading] = useState<boolean>(false)
  const { unsubscribe, isUnsubscribing } = useManageSubscription(account)

  const { scopes: currentScopes, updateScopes } = useSubscriptionScopes(account)
  const [scopes, setScopes] = useState<NotifyClientTypes.NotifySubscription['scope']>({})

  const toast = useToast()
  const prevScopesRef = useRef<NotifyClientTypes.NotifySubscription['scope']>(currentScopes)
  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current)

  const getEnabledScopes = (scopesMap: NotifyClientTypes.NotifySubscription['scope']) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if (scope.enabled) enabledScopeKeys.push(key)
    })
    return enabledScopeKeys
  }
  useEffect(() => {
    if (!currentScopes) return
    setScopes(currentScopes)
    prevScopesRef.current = currentScopes
  }, [currentScopes])

  const handleUpdatePreferences = useCallback(async () => {
    try {
      await updateScopes(getEnabledScopes(scopes))
      const newScope = currentScopes
      prevScopesRef.current = newScope
    } catch (error: any) {
      toast.toastError(Events.PreferencesError.title, Events.PreferencesError.message)
    }
  }, [currentScopes, toast, scopes, updateScopes])

  const handleUnSubscribe = useCallback(async () => {
    setloading(true)
    try {
      await unsubscribe()
    } catch (error: any) {
      toast.toastError(Events.UnsubscribeError.title, Events.UnsubscribeError.message)
    }
    setloading(false)
  }, [unsubscribe, toast])

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
            isUnsubscribing={loading || isUnsubscribing}
            handleSubscriptionAction={handleAction}
            objectsAreEqual={objectsAreEqual}
          />
        </Box>
      </ScrollableContainer>
    </Box>
  )
}

export default NotificationSettingsMain
