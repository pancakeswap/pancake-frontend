import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useSignMessage } from 'wagmi'
import useFormattedEip155Account from '../components/hooks/useFormatEip155Account'
import { DEFAULT_APP_METADATA, Events } from '../constants'
import { SubscriptionState } from '../types'

interface IOnboardingButtonProps {
  account: string
  onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void
  subscriptionState: SubscriptionState
}

interface IOnboardingProps {
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
}

function OnboardingButton({ account, onClick, subscriptionState }: IOnboardingButtonProps) {
  const { t } = useTranslation()

  let buttonText: string = t('Enable (Subscribe in wallet)')
  if (subscriptionState.isOnboarding) {
    buttonText = t('Awaiting signature response')
  }
  if (!subscriptionState.isOnboarded) {
    buttonText = t('Authorize Notifications')
  }
  if (subscriptionState.isSubscribing) {
    buttonText = t('Sign again in wallet')
  }

  if (!account)
    return (
      <AutoColumn gap="md" marginTop="6px" width="100%">
        <ConnectWalletButton height="50px" />
      </AutoColumn>
    )

  return (
    <AutoColumn gap="md" marginTop="6px" width="100%">
      <CommitButton
        variant="primary"
        onClick={onClick}
        isLoading={subscriptionState.isSubscribing || subscriptionState.isOnboarding}
        height="50px"
      >
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {buttonText}
          </Text>
          {subscriptionState.isSubscribing || subscriptionState.isOnboarding ? <CircleLoader stroke="white" /> : null}
        </Flex>
      </CommitButton>
    </AutoColumn>
  )
}

const OnBoardingView = ({ setSubscriptionState, subscriptionState }: IOnboardingProps) => {
  const { signMessageAsync } = useSignMessage()
  const { toastSuccess, toastError } = useToast()
  const { formattedEip155Account, account } = useFormattedEip155Account()
  const { registerMessage, postMessage, subscribe } = useWalletConnectPushClient()

  const handleOnboarding = useCallback(() => {
    setSubscriptionState((prevState) => ({ ...prevState, isOnboarding: true }))
    toastSuccess(Events.SignatureRequest.title, Events.SignatureRequest.message)

    signMessageAsync({ message: registerMessage })
      .then((signature) => {
        postMessage(formatJsonRpcRequest('push_signature_delivered', { signature }))
        setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: true, isOnboarding: false }))
      })
      .catch((error: Error) => {
        setSubscriptionState((prevState) => ({ ...prevState, isOnboarded: false, isOnboarding: false }))
        const errormessage = error.message.includes('User rejected') ? 'User Rejected the request' : error.message
        toastError(Events.SignatureRequestError.title, errormessage)
      })
  }, [registerMessage, setSubscriptionState, postMessage, signMessageAsync, toastError, toastSuccess])

  const handleSubscribe = useCallback(async () => {
    try {
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribing: true }))
      const subscribed = await subscribe({ account: formattedEip155Account, metadata: DEFAULT_APP_METADATA })
      if (subscribed) setSubscriptionState((prevState) => ({ ...prevState, isSubscribed: true, isSubscribing: false }))
      else throw new Error('Subscription request failed')
    } catch (error: any) {
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribing: false }))
      toastError(Events.SubscriptionRequestError.title, Events.SubscriptionRequestError.message)
    }
  }, [formattedEip155Account, toastError, setSubscriptionState, subscribe])

  const handleAction = useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation()
      if (subscriptionState.isOnboarded) handleSubscribe()
      else handleOnboarding()
    },
    [handleOnboarding, handleSubscribe, subscriptionState.isOnboarded],
  )
  return (
    <Box padding="24px">
      <Box pl="24px">
        <Image src="/IMG.png" alt="#" height={185} width={270} />
      </Box>
      <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          Notifications From PancakeSwap
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          Get started with notifications from WalletConnect. Click the subscribe button below and accept.
        </Text>
        <OnboardingButton subscriptionState={subscriptionState} onClick={handleAction} account={account} />
      </FlexGap>
    </Box>
  )
}

export default OnBoardingView
