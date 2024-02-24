import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { usePrepareRegistration, useRegister, useSubscribe } from '@web3inbox/react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useSignMessage } from 'wagmi'
import { Events } from '../constants'
import useSendPushNotification from '../hooks/sendPushNotification'
import { parseErrorMessage } from '../utils/errorBuilder'
import { getOnBoardingButtonText, getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnboardingButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  loading: boolean
  isOnBoarded: boolean
  account: string | undefined | null
  isReady: boolean
}

interface IOnBoardingProps {
  isReady: boolean
  account: string | null | undefined
  isRegistered: boolean
}

function OnboardingButton({ onClick, loading, isOnBoarded, account, isReady }: IOnboardingButtonProps) {
  const { t } = useTranslation()
  const buttonText = getOnBoardingButtonText(isOnBoarded, loading, t)

  if (!account)
    return (
      <AutoColumn gap="md" marginTop="24px" width="100%">
        <ConnectWalletButton height="50px" disabled={!isReady} />
      </AutoColumn>
    )

  return (
    <AutoColumn gap="md" marginTop="24px" width="100%">
      <CommitButton variant="primary" onClick={onClick} isLoading={loading} height="50px">
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

const OnBoardingView = ({ isReady, account, isRegistered }: IOnBoardingProps) => {
  const [isRegistering, setIsRegistering] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()

  const { subscribe } = useSubscribe()
  const { subscribeToPushNotifications } = useSendPushNotification()
  const { signMessageAsync } = useSignMessage()
  const { prepareRegistration } = usePrepareRegistration()
  const { register } = useRegister()

  const handleRegistration = useCallback(async () => {
    setIsRegistering(true)

    try {
      const { message, registerParams } = await prepareRegistration()
      const signature = await signMessageAsync({ message })
      await register({ registerParams, signature })
    } catch (error) {
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title(t), errMessage)
    } finally {
      setIsRegistering(false)
    }
  }, [t, signMessageAsync, prepareRegistration, register, toast])

  const handleSubscribe = useCallback(async () => {
    try {
      if (isRegistered) {
        await subscribe()
        await subscribeToPushNotifications()
      }
    } catch (error) {
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title(t), errMessage)
    }
  }, [t, toast, subscribe, isRegistered, subscribeToPushNotifications])

  const handleOnBoarding = useCallback(async () => {
    try {
      await handleRegistration()
    } catch (error) {
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title(t), errMessage)
    }
  }, [t, handleRegistration, toast])

  const handleAction = useCallback(
    async (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!isRegistered) handleOnBoarding()
      else handleSubscribe()
    },
    [handleSubscribe, handleOnBoarding, isRegistered],
  )

  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(isRegistered), t)

  return (
    <Box width="100%" maxHeight="400px">
      <div style={{ padding: '24px' }}>
        <Box pl="40px" pb="24px" pt="48px">
          <Image src="/images/notifications/welcome-notification-bell.png" alt="#" height={185} width={270} />
        </Box>
        <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
            {t('Notifications From PancakeSwap')}
          </Text>
          <Text fontSize="16px" textAlign="center" color="textSubtle">
            {onBoardingDescription}
          </Text>
          <OnboardingButton
            loading={isRegistering}
            onClick={handleAction}
            isOnBoarded={Boolean(isRegistered)}
            account={account}
            isReady={isReady}
          />
        </FlexGap>
      </div>
    </Box>
  )
}

export default OnBoardingView
