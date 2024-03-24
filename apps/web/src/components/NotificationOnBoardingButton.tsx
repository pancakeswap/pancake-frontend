import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import {
  usePrepareRegistration,
  useRegister,
  useSubscribe,
  useSubscription,
  useWeb3InboxAccount,
  useWeb3InboxClient,
} from '@web3inbox/react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useSubscribeToWebPushNotifications from 'hooks/useSubscribeToWebPush'
import React, { useCallback, useState } from 'react'
import { useAllowNotifications } from 'state/notifications/hooks'
import { useAccount, useSignMessage } from 'wagmi'

export const parseErrorMessage = (error: any) =>
  error instanceof Error && error?.message ? error.message : JSON.stringify(error)

const getOnBoardingButtonText = (
  areNotificationsEnabled: boolean,
  isRegistered: boolean,
  isSubscribed: boolean,
  t: TranslateFunction,
) => {
  const isStep1 = Boolean(!areNotificationsEnabled)
  const isStep2 = Boolean(areNotificationsEnabled && !isRegistered)
  const isStep3 = Boolean(isRegistered && !isSubscribed)

  if (isStep1) return t('Enable Notifications')
  if (isStep2) return t('Sign In With Wallet')
  if (isStep3) return t('Subscribe To PancakeSwap')

  return t('Enable Notifications')
}

function NotificationsOnboardingButton({ ...props }: React.CSSProperties) {
  const [isRegistering, setIsRegistering] = useState(false)

  const toast = useToast()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [allowNotifications, setAllowNotifications] = useAllowNotifications()

  const { data: client } = useWeb3InboxClient()
  const { isRegistered } = useWeb3InboxAccount(`eip155:1:${address}`)
  const { subscribe, isLoading: isSubscribing } = useSubscribe()
  const { subscribeToWebPush } = useSubscribeToWebPushNotifications()
  const { data: subscription } = useSubscription()
  const { prepareRegistration } = usePrepareRegistration()
  const { register } = useRegister()

  const handleRegistration = useCallback(async () => {
    setIsRegistering(true)
    try {
      const { message, registerParams } = await prepareRegistration()
      const signature = await signMessageAsync({ message })
      await register({ registerParams, signature })
    } catch (error) {
      const errMessage = parseErrorMessage(error)
      toast.toastError(t('Registration Error'), errMessage)
    } finally {
      setIsRegistering(false)
    }
  }, [t, signMessageAsync, prepareRegistration, register, toast])

  const handleSubscribe = useCallback(async () => {
    try {
      if (isRegistered) {
        await subscribe()
        await subscribeToWebPush()
      }
    } catch (error) {
      const errMessage = parseErrorMessage(error)
      toast.toastError(t('Subscription Error'), errMessage)
    }
  }, [t, toast, subscribe, isRegistered, subscribeToWebPush])

  const handleAction = useCallback(
    async (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!allowNotifications) setAllowNotifications(true)
      if (!isRegistered) handleRegistration()
      else handleSubscribe()
    },
    [handleSubscribe, handleRegistration, isRegistered, setAllowNotifications, allowNotifications],
  )

  const isReady = Boolean(client)
  const isSubscribed = Boolean(subscription)
  const loading = isSubscribing || isRegistering
  const buttonText = getOnBoardingButtonText(Boolean(allowNotifications), isRegistered, isSubscribed, t)

  if (!address)
    return (
      <AutoColumn gap="md" width="100%">
        <ConnectWalletButton style={{ ...props }} disabled={!isReady} />
      </AutoColumn>
    )

  return (
    <AutoColumn gap="md" width="100%">
      <CommitButton variant="primary" onClick={handleAction} isLoading={loading} style={{ ...props }}>
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {buttonText}
          </Text>
          {loading ? <CircleLoader stroke="white" /> : null}
        </Flex>
      </CommitButton>
    </AutoColumn>
  )
}

export default NotificationsOnboardingButton
