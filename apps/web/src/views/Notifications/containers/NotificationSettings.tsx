import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowBackIcon,
  AutoColumn,
  Box,
  CircleLoader,
  CloseIcon,
  FlexGap,
  IconButton,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import _isEqual from 'lodash/isEqual'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useManageSubscription, useSubscriptionScopes } from '@web3inbox/widget-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NotificationHeader } from '../components/NotificationHeader/NotificationHeader'
import SettingsContainer from '../components/SettingsItem/SettingsItem'
import { Events } from '../constants'
import { ScrollableContainer } from '../styles'
import { parseErrorMessage } from '../utils/errorBuilder'
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
    <AutoColumn>
      <CommitButton onClick={handleSubscriptionAction} isLoading={isUnsubscribing}>
        <FlexGap alignItems="center" gap="6px">
          <Text fontWeight="bold" color="white">
            {buttonText}
          </Text>
          {isUnsubscribing ? <CircleLoader stroke="white" /> : null}
        </FlexGap>
      </CommitButton>
    </AutoColumn>
  )
}

const NotificationSettingsView = ({
  toggleSettings,
  onDismiss,
  account,
}: {
  toggleSettings: (e: React.MouseEvent<HTMLButtonElement>) => void
  onDismiss: () => void
  toggleOnboardView: () => void
  account: string
}) => {
  const { unsubscribe, isUnsubscribing } = useManageSubscription(account)
  const { scopes: currentScopes, updateScopes } = useSubscriptionScopes(account)
  const [scopes, setScopes] = useState<NotifyClientTypes.ScopeMap>({})
  const prevScopesRef = useRef<NotifyClientTypes.ScopeMap>(currentScopes)
  const toast = useToast()
  const { t } = useTranslation()
  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current)

  const getEnabledScopes = (scopesMap: NotifyClientTypes.ScopeMap) => {
    const enabledScopeKeys: string[] = []
    Object.entries(scopesMap).forEach(([key, scope]) => {
      if ((scope as any).enabled) enabledScopeKeys.push(key)
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
      toast.toastSuccess(Events.PreferencesUpdated.title, Events.PreferencesUpdated.message?.())
    } catch (error) {
      const errMessage = parseErrorMessage(Events.PreferencesError, error)
      toast.toastError(Events.PreferencesError.title, errMessage)
    }
  }, [currentScopes, toast, scopes, updateScopes])

  const handleUnSubscribe = useCallback(async () => {
    try {
      await unsubscribe()
      toast.toastSuccess(Events.Unsubscribed.title, Events.Unsubscribed.message?.())
    } catch (error) {
      const errMessage = parseErrorMessage(Events.UnsubscribeError, error)
      toast.toastWarning(Events.UnsubscribeError.title, errMessage)
    }
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
    <Box width="100%">
      <NotificationHeader
        leftIcon={
          <IconButton tabIndex={-1} variant="text" onClick={toggleSettings}>
            <ArrowBackIcon color="primary" />
          </IconButton>
        }
        rightIcon={
          <IconButton tabIndex={-1} variant="text" onClick={onDismiss}>
            <CloseIcon color="primary" />
          </IconButton>
        }
        text={t('Settings')}
      />
      <ScrollableContainer>
        <SettingsContainer scopes={scopes} setScopes={setScopes} />
        <Box padding="20px">
          <NotificationActionButton
            isUnsubscribing={isUnsubscribing}
            handleSubscriptionAction={handleAction}
            objectsAreEqual={objectsAreEqual}
          />
        </Box>
      </ScrollableContainer>
    </Box>
  )
}

export default NotificationSettingsView
