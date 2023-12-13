import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { Events } from '../constants'
import useSendPushNotification from '../hooks/sendPushNotification'
import { BuilderNames } from '../types'
import { parseErrorMessage } from '../utils/errorBuilder'
import { getOnBoardingButtonText, getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnboardingButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  loading: boolean
  isOnBoarded: boolean
  account: string | undefined
  isReady: boolean
}

interface IOnBoardingProps {
  identityKey: string | undefined
  handleRegistration: () => Promise<void>
  isReady: boolean
  isSubscribing: boolean
  setIsSubscribing: (state: boolean) => void
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
      <CommitButton variant="primary" onClick={onClick} isLoading={loading} height="50px" disabled={!isReady}>
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

const OnBoardingView = ({
  identityKey,
  handleRegistration,
  isReady,
  isSubscribing,
  setIsSubscribing,
}: IOnBoardingProps) => {
  const [isOboarding, setIsOnBoarding] = useState<boolean>(false)
  const toast = useToast()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { subscribe } = useManageSubscription(`eip155:1:${account}`)
  const { sendPushNotification, subscribeToPushNotifications } = useSendPushNotification()

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true)
    try {
      await subscribeToPushNotifications()
      await subscribe()
      setTimeout(async () => {
        await sendPushNotification(BuilderNames.OnBoardNotification, [], `eip155:1:${account}`)
      }, 1200)
    } catch (error) {
      setIsSubscribing(false)
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title, errMessage)
    }
  }, [account, toast, sendPushNotification, subscribe, subscribeToPushNotifications, setIsSubscribing])

  const handleOnBoarding = useCallback(async () => {
    setIsOnBoarding(true)
    try {
      await handleRegistration()
    } catch (error) {
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title, errMessage)
    }
    setIsOnBoarding(false)
  }, [setIsOnBoarding, handleRegistration, toast])

  const handleAction = useCallback(
    async (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!identityKey) handleOnBoarding()
      else handleSubscribe()
    },
    [handleSubscribe, handleOnBoarding, identityKey],
  )

  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(identityKey), t)

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
            loading={isSubscribing || isOboarding}
            onClick={handleAction}
            isOnBoarded={Boolean(identityKey)}
            account={account}
            isReady={isReady}
          />
        </FlexGap>
      </div>
    </Box>
  )
}

export default OnBoardingView
