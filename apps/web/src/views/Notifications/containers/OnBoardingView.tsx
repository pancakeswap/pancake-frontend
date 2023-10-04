import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import useSendPushNotification from '../components/hooks/sendPushNotification'
import useRegistration from '../components/hooks/useRegistration'
import { Events } from '../constants'
import { BuilderNames } from '../types'
import { getOnBoardingButtonText, getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnboardingButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  loading: boolean
  isOnBoarded: boolean
}

interface IOnBoardingProps {
  setIsRightView: Dispatch<SetStateAction<boolean>>
  identityKey: string | null
  handleRegistration: () => Promise<void>
  account: string | undefined
}

function OnboardingButton({ onClick, loading, isOnBoarded }: IOnboardingButtonProps) {
  const { t } = useTranslation()
  const { account: eip155Account } = useRegistration()
  const buttonText = getOnBoardingButtonText(isOnBoarded, loading, t)

  if (!eip155Account)
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

const OnBoardingView = ({ setIsRightView, identityKey, handleRegistration, account }: IOnBoardingProps) => {
  const [loading, setloading] = useState<boolean>(false)
  const toast = useToast()
  const { t } = useTranslation()
  const { subscribe, isSubscribing } = useManageSubscription(account)
  const { sendPushNotification, requestNotificationPermission } = useSendPushNotification()

  const handleSubscribe = useCallback(async () => {
    if (!account) return
    setloading(true)
    try {
      await subscribe()
      setIsRightView(true)
      setTimeout(() => sendPushNotification(BuilderNames.OnBoardNotification, []), 1000)
      setloading(false)
    } catch (error) {
      toast.toastError(Events.SubscriptionRequestError.title, 'Unable to subscribe')
      setloading(false)
    }
  }, [account, setloading, toast, sendPushNotification, subscribe, setIsRightView])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!identityKey) requestNotificationPermission().then(() => handleRegistration())
      else handleSubscribe()
    },
    [handleRegistration, handleSubscribe, identityKey, requestNotificationPermission],
  )

  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(identityKey), t)

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
          {onBoardingDescription}
        </Text>
        <OnboardingButton
          loading={loading || isSubscribing}
          onClick={handleAction}
          isOnBoarded={Boolean(identityKey)}
        />
      </FlexGap>
    </Box>
  )
}

export default OnBoardingView
