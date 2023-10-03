import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { usePushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useSignMessage } from 'wagmi'
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";
import useSendPushNotification from '../components/hooks/sendPushNotification'
import useFormattedEip155Account from '../components/hooks/useFormatEip155Account'
import { DEFAULT_APP_METADATA, Events } from '../constants'
import { BuilderNames } from '../types'
import { getOnBoardingButtonText, getOnBoardingDescriptionMessage } from '../utils/textHelpers'

interface IOnboardingButtonProps {
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  loading: boolean
  isOnBoarded: boolean
  onBoardingStep: 'identity' | 'sync'
}

interface IOnBoardingProps {
  setIsRightView: Dispatch<SetStateAction<boolean>>
  onBoardingStep: 'identity' | 'sync'
}

function OnboardingButton({ onClick, loading, isOnBoarded, onBoardingStep }: IOnboardingButtonProps) {
  const { t } = useTranslation()
  const { eip155Account } = useFormattedEip155Account()
  const buttonText = getOnBoardingButtonText(onBoardingStep, isOnBoarded, loading, t)

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

const OnBoardingView = ({ setIsRightView, onBoardingStep }: IOnBoardingProps) => {
  const { signMessageAsync } = useSignMessage()
  const [loading, setloading] = useState<boolean>(false)
  const { pushClientProxy: pushClient, refreshNotifications, pushRegisterMessage, isOnBoarded } = usePushClient()
  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();

  const toast = useToast()
  const { eip155Account } = useFormattedEip155Account()
  const { sendPushNotification, subscribeToPushNotifications, requestNotificationPermission } =
    useSendPushNotification()

  const { t } = useTranslation()

  const signMessage = useCallback(
    async (message: string) => {
      const res = await signMessageAsync({
        message,
      });

      return res as string;
    },
    [signMessageAsync]
  );

  const handleRegistration = useCallback(async () => {
    if (!account) return;
    try {
      await registerIdentity(signMessage);
    } catch (registerIdentityError) {
      console.error({ registerIdentityError });
    }
  }, [signMessage, registerIdentity, account]);

  const handleOnboarding = useCallback(() => {
    setloading(true)
    signMessageAsync({ message: pushRegisterMessage })
      .then((signature) => {
        pushClient.postMessage(formatJsonRpcRequest('notify_signature_delivered', { signature }))
        setloading(false)
      })
      .catch((error) => {
        console.error(error)
        setloading(false)
      })
  }, [pushRegisterMessage, setloading, pushClient, signMessageAsync])

  const handleSubscribe = useCallback(async () => {
    if (!eip155Account) return
    setloading(true)

    pushClient.emitter.on('notify_subscription', () => {
      toast.toastSuccess('Already subscribed', 'actibating current subscription')
      sendPushNotification(BuilderNames.OnBoardNotification, [])
      setIsRightView(true)
      refreshNotifications()
    })
    try {
      await subscribeToPushNotifications()
      await pushClient.subscribe({
        account: eip155Account,
        metadata: DEFAULT_APP_METADATA,
      })
      setloading(false)
    } catch (error) {
      toast.toastError(Events.SubscriptionRequestError.title, 'Unable to subscribe')
      setloading(false)
    }
  }, [
    eip155Account,
    pushClient,
    setloading,
    toast,
    refreshNotifications,
    sendPushNotification,
    subscribeToPushNotifications,
    setIsRightView,
  ])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (identityKey) handleRegistration()
      else console.log('yerp')
    },
    [handleOnboarding, handleSubscribe, isOnBoarded, requestNotificationPermission],
  )
  const onBoardingDescription = getOnBoardingDescriptionMessage(onBoardingStep, isOnBoarded, t)

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
          loading={loading}
          onClick={handleAction}
          isOnBoarded={isOnBoarded}
          onBoardingStep={onBoardingStep}
        />
      </FlexGap>
    </Box>
  )
}

export default OnBoardingView
