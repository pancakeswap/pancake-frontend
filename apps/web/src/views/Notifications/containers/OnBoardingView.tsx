import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { usePushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Events } from '../constants'
import { BuilderNames } from '../types'
import useSendPushNotification from '../components/hooks/sendPushNotification'
import useFormattedEip155Account from '../components/hooks/useFormatEip155Account'

interface IOnboardingButtonProps {
  account: string
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  loading: boolean
  isOnBoarded: boolean
}

function OnboardingButton({ account, onClick, loading, isOnBoarded }: IOnboardingButtonProps) {
  const { t } = useTranslation()

  let buttonText: string = t('Enable (Subscribe in wallet)')
  if (loading) {
    buttonText = t('Awaiting signature response')
  }
  if (!isOnBoarded) {
    buttonText = t('Authorize In Wallet')
  }

  if (!account)
    return (
      <AutoColumn gap="md" marginTop="6px" width="100%">
        <ConnectWalletButton height="50px" />
      </AutoColumn>
    )

  return (
    <AutoColumn gap="md" marginTop="6px" width="100%">
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

const OnBoardingView = ({ setIsRightView }: { setIsRightView: Dispatch<SetStateAction<boolean>> }) => {
  const [loading, setloading] = useState<boolean>(false)
  const {
    pushClientProxy: pushClient,
    userPubkey,
    refreshNotifications,
    isOnBoarded,
    handleRegistration,
  } = usePushClient()

  const toast = useToast()
  const { eip155Account } = useFormattedEip155Account()
  const { sendPushNotification, subscribeToPushNotifications, requestNotificationPermission } =
    useSendPushNotification()

  const { t } = useTranslation()

  const handleOnboarding = useCallback(async () => {
    setloading(true)
    toast.toastSuccess(Events.SignatureRequest.title, Events.SignatureRequest.message)

    handleRegistration(userPubkey, false).catch((error: Error) => {
      const errormessage = error.message.includes('User rejected') ? t('User Rejected the request') : error.message
      toast.toastError(Events.SignatureRequestError.title, errormessage)
    })
    setloading(false)
  }, [toast, t, handleRegistration, userPubkey])

  const handleSubscribe = useCallback(async () => {
    setloading(true)
    setIsRightView(false)

    pushClient?.emitter.on('push_subscription', () => {
      toast.toastSuccess('succcess', Events.SubscriptionRequestError.message)
      sendPushNotification(BuilderNames.OnBoardNotification, [])
      refreshNotifications()
    })
    pushClient
      .subscribe({ account: eip155Account })
      .then((subscribed: { id: number; subscriptionAuth: string }) => {
        if (!subscribed) throw new Error('Subscription request failed')
        setloading(false)
        subscribeToPushNotifications()
      })
      .catch((error: Error) => {
        toast.toastError(Events.SubscriptionRequestError.title, error.message)
        setloading(false)
      })
  }, [
    eip155Account,
    pushClient,
    toast,
    sendPushNotification,
    refreshNotifications,
    setIsRightView,
    subscribeToPushNotifications,
  ])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (isOnBoarded) requestNotificationPermission().then(async () => handleSubscribe())
      else handleOnboarding()
    },
    [handleOnboarding, handleSubscribe, isOnBoarded, requestNotificationPermission],
  )

  return (
    <Box padding="24px">
      <Box pl="24px">
        <Image src="/IMG.png" alt="#" height={185} width={270} />
      </Box>
      <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          {t('Notifications From PancakeSwap')}
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          {t('Get started with notifications from WalletConnect. Click the subscribe button below and accept')}
        </Text>
        <OnboardingButton loading={loading} onClick={handleAction} account={userPubkey} isOnBoarded={isOnBoarded} />
      </FlexGap>
    </Box>
  )
}

export default OnBoardingView
