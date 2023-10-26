import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  Box,
  CircleLoader,
  Flex,
  FlexGap,
  Heading,
  LogoRoundIcon,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Image from 'next/image'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import useSendPushNotification from '../hooks/sendPushNotification'
import { Events } from '../constants'
import { BuilderNames } from '../types'
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

const OnBoardingView = ({ identityKey, handleRegistration, isReady }: IOnBoardingProps) => {
  const toast = useToast()
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { subscribe, isSubscribing } = useManageSubscription()
  const { sendPushNotification } = useSendPushNotification()

  const handleSubscribe = useCallback(async () => {
    try {
      await subscribe()
      setTimeout(() => sendPushNotification(BuilderNames.OnBoardNotification, [], `eip155:1:${account}`), 1000)
    } catch (error) {
      toast.toastError(Events.SubscriptionRequestError.title, 'Unable to subscribe')
    }
  }, [account, toast, sendPushNotification, subscribe])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (!identityKey) handleRegistration()
      else handleSubscribe()
    },
    [handleRegistration, handleSubscribe, identityKey],
  )

  const onBoardingDescription = getOnBoardingDescriptionMessage(Boolean(identityKey), t)

  return (
    <Box width="100%">
      <div style={{ padding: '24px' }}>
        <Box display="flex">
          <LogoRoundIcon width="40px" mr="12px" />
          <Heading fontSize="24px" padding="0px" textAlign="left" mr="8px">
            {t('PancakeSwap would like to send you notifications')}
          </Heading>
        </Box>

        <Box pl="24px" pt="24px">
          <Image src="/images/notifications/notification-bell-check.png" alt="#" height={185} width={270} />
        </Box>
        <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
          <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
            {t('Notifications From PancakeSwap')}
          </Text>
          <Text fontSize="16px" textAlign="center" color="textSubtle">
            {onBoardingDescription}
          </Text>
          <OnboardingButton
            loading={isSubscribing}
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
