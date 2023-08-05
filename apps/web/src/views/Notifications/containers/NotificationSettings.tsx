import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { PushClientTypes, WalletClient } from '@walletconnect/push-client'
import { CommitButton } from 'components/CommitButton'
import _isEqual from 'lodash/isEqual'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import SettingsContainer from '../components/Settingsitem/SettingsItem'
import { ScrollableContainer } from '../styles'
import { SubscriptionState } from '../types'

interface PushSubButtonProps {
  isUnsubscribing: boolean
  handleSubscriptionAction: (e: React.MouseEvent<HTMLButtonElement>) => void
  objectsAreEqual: boolean
}

function NotificationActionButton({ isUnsubscribing, handleSubscriptionAction, objectsAreEqual }: PushSubButtonProps) {
  const { t } = useTranslation()

  let buttonText: string = t('Unsubscribe')
  if (objectsAreEqual) {
    buttonText = isUnsubscribing ? t('unSubscribing') : t('Unsubscribe')
  } else buttonText = isUnsubscribing ? t('Updating') : t('Update Preferences')

  return (
    <AutoColumn gap="md" marginTop="6px">
      <CommitButton variant="primary" onClick={handleSubscriptionAction} isLoading={isUnsubscribing} height="55px">
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
  pushClient: WalletClient
  chainId: number
  account: string
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
  currentSubscription: PushClientTypes.PushSubscription | null
}

const NotificationSettingsMain = ({
  pushClient,
  chainId,
  account,
  setSubscriptionState,
  subscriptionState,
  currentSubscription,
}: ISettingsProps) => {
  const { toastError } = useToast()
  const { t } = useTranslation()
  const [scopes, setScopes] = useState<PushClientTypes.PushSubscription['scope']>({})
  const prevScopesRef = useRef<PushClientTypes.PushSubscription['scope']>(scopes)

  const objectsAreEqual = _isEqual(scopes, prevScopesRef.current)

  // Reduces the scopes mapping to only an array of enabled scopes
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
  }, [currentSubscription?.scope, account, chainId])

  const handleUpdatePreferences = useCallback(async () => {
    if (pushClient && currentSubscription && currentSubscription?.topic) {
      try {
        // @ts-ignore
        pushClient?.emit('push_update', {})
        await pushClient.update({
          topic: currentSubscription?.topic,
          scope: getEnabledScopes(scopes),
        })
        const newScope = currentSubscription
        prevScopesRef.current = newScope?.scope
        toastError(`${t('Success!')}!`, <Text>{t('Your preferances have been changed.')}</Text>)
      } catch (error) {
        if (error instanceof Error) {
          toastError(`${t('Something went wrong')}!`, <Text>{t(error.message)}</Text>)
        }
      }
    }
  }, [pushClient, scopes, currentSubscription, toastError, t])

  const handleUnSubscribe = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: true }))

      try {
        if (currentSubscription?.topic) {
          await pushClient.deleteSubscription({ topic: currentSubscription?.topic })
          setSubscriptionState((prevState) => ({
            ...prevState,
            isOnboarding: false,
            isSubscribed: false,
            isUnsubscribing: false,
          }))
          // @ts-ignore
          pushClient.emit('push_delete', {})
        }
      } catch (error) {
        setSubscriptionState((prevState) => ({ ...prevState, isUnsubscribing: false }))

        if (error instanceof Error) {
          toastError(`${t('Something went wrong')}!`, <Text>{t(error.message)}</Text>)
        }
      }
    },
    [setSubscriptionState, pushClient, currentSubscription?.topic, toastError, t],
  )

  return (
    <Box paddingX="24px" paddingBottom="24px">
      <ScrollableContainer>
        <SettingsContainer account={account} scopes={scopes} setScopes={setScopes} />
        <Box>
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
