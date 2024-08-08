import { TranslateFunction, useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, Text, useToast } from '@pancakeswap/uikit'
import { usePrepareRegistration, useRegister, useSubscribe, useSubscription } from '@web3inbox/react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useSubscribeToWebPushNotifications from 'hooks/useSubscribeToWebPush'
import React, { useCallback, useState } from 'react'
import { useAllowNotifications } from 'state/notifications/hooks'
import useSendPushNotification from 'views/Notifications/hooks/sendPushNotification'
import { BuilderNames } from 'views/Notifications/types'
import { useAccount, useSignMessage } from 'wagmi'

interface IOnBoardingButtonProps {
  isRegistered: boolean
  isReady: boolean
  onExternalDismiss?: () => void
}

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
  const isStep4 = Boolean(isSubscribed)

  if (isStep1) return t('Enable Notifications')
  if (isStep2) return t('Sign In With Wallet')
  if (isStep3) return t('Subscribe To PancakeSwap')
  if (isStep4) return t('Continue')

  return t('Enable Notifications')
}

function NotificationsOnboardingButton({
  isReady,
  isRegistered,
  onExternalDismiss,
  ...props
}: IOnBoardingButtonProps & React.CSSProperties) {
  const [isRegistering, setIsRegistering] = useState(false)

  const toast = useToast()
  const { t } = useTranslation()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [allowNotifications, setAllowNotifications] = useAllowNotifications()

  const { subscribe, isLoading: isSubscribing } = useSubscribe()
  const { subscribeToWebPush } = useSubscribeToWebPushNotifications()
  const { sendPushNotification } = useSendPushNotification()

  const { data: subscription } = useSubscription()
  const { prepareRegistration } = usePrepareRegistration()
  const { register } = useRegister()

  const isSubscribed = Boolean(subscription)
  const loading = isSubscribing || isRegistering
  const buttonText = getOnBoardingButtonText(Boolean(allowNotifications), isRegistered, isSubscribed, t)

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
      if (isRegistered && address) {
        await subscribe()
        await subscribeToWebPush()

        // delay before firing notification
        setTimeout(async () => {
          await sendPushNotification(BuilderNames.onBoardingNotification, [], address)
        }, 1500)
      }
    } catch (error) {
      const errMessage = parseErrorMessage(error)
      toast.toastError(t('Subscription Error'), errMessage)
    }
  }, [t, toast, subscribe, isRegistered, subscribeToWebPush, address, sendPushNotification])

  const handleAction = useCallback(
    async (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!allowNotifications) setAllowNotifications(true)
      if (!isRegistered) handleRegistration()
      if (isSubscribed && onExternalDismiss) onExternalDismiss?.()
      else handleSubscribe()
    },
    [
      handleSubscribe,
      handleRegistration,
      isRegistered,
      isSubscribed,
      onExternalDismiss,
      setAllowNotifications,
      allowNotifications,
    ],
  )

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
