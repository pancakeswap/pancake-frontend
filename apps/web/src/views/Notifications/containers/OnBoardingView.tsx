import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, CircleLoader, Flex, FlexGap, Text, useToast } from '@pancakeswap/uikit'
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { CommitButton } from 'components/CommitButton'
import { ConnectorNames } from 'config/wallet'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import useAuth from 'hooks/useAuth'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useChainId, useSignMessage } from 'wagmi'
import { DEFAULT_APP_METADATA } from '../constants'
import { SubscriptionState } from '../types'

function OnboardingButton({
  setSubscriptionState,
  subscriptionState,
}: {
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
}) {
  const { t } = useTranslation()
  const { login } = useAuth()
  const { signMessageAsync } = useSignMessage()
  const { toastSuccess, toastError } = useToast()
  const chainId = useChainId()
  const { pushClient, registerMessage: pushRegisterMessage, postMessage, account } = useWalletConnectPushClient()

  const handleOnboarding = useCallback(() => {
    setSubscriptionState((prevState) => ({ ...prevState, isOnboarding: true }))
    toastSuccess(`${t('Request Sent')}!`, <Text>{t('Please sign the subscription request sent to your wallet')}</Text>)
    signMessageAsync({ message: pushRegisterMessage })
      .then((signature) => {
        postMessage(formatJsonRpcRequest('push_signature_delivered', { signature }))
      })
      .catch((error) => {
        if (error instanceof Error) {
          toastError(`${t('Subscription Request Error')}!`, <Text>{t(error.message)}</Text>)
        }
      })
  }, [pushRegisterMessage, t, setSubscriptionState, postMessage, signMessageAsync, toastError, toastSuccess])

  const handleSubscribe = useCallback(async () => {
    if (!account) {
      login('walletConnect' as ConnectorNames)
      return
    }
    setSubscriptionState((prevState) => ({ ...prevState, isSubscribing: true }))
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      // Resolve known pairings from the Core's Pairing API.
      const subscribed = await pushClient.subscribe({
        account: `eip155:${chainId}:${account}`,
        metadata: DEFAULT_APP_METADATA,
        onSign: async (message) => {
          const signature = await signMessageAsync({ message })
          return signature
        },
      })
      if (!subscribed) {
        throw new Error('Subscription request failed', {
          cause: 'Push propose failed',
        })
      }
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribed: true, isSubscribing: false }))
      if (!subscribed.subscriptionAuth) {
        toastSuccess(
          `${t('Subscription Request')}!`,
          <Text>{t('Please sign the subscription request sent to your wallet')}</Text>,
        )
      }
    } catch (error) {
      setSubscriptionState((prevState) => ({ ...prevState, isSubscribing: false }))
      if (error instanceof Error) {
        toastError(`${t('Subscription Request eError')}!`, <Text>{t(error.message)}</Text>)
      }
    }
  }, [pushClient, account, toastSuccess, toastError, t, chainId, signMessageAsync, setSubscriptionState, login])

  const handleAction = useCallback(
    (e) => {
      e.stopPropagation()
      if (subscriptionState.isOnboarded) handleSubscribe()
      handleOnboarding()
    },
    [handleOnboarding, handleSubscribe, subscriptionState.isOnboarded],
  )

  let buttonText: string = t('Enable (Subscribe in wallet)')
  if (!account) {
    buttonText = t('Connect Wallet')
  }
  if (subscriptionState.isOnboarding) {
    buttonText = t('Awaiting signature response')
  }
  if (!subscriptionState.isOnboarded) {
    buttonText = t('Authorize Notifications')
  }
  if (subscriptionState.isSubscribing) {
    buttonText = t('Subscribing')
  }

  return (
    <AutoColumn gap="md" marginTop="6px" width="100%">
      <CommitButton
        variant="primary"
        onClick={handleAction}
        isLoading={subscriptionState.isSubscribing || subscriptionState.isOnboarding}
        height="55px"
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

const SubscribedView = ({
  setSubscriptionState,
  subscriptionState,
}: {
  setSubscriptionState: Dispatch<SetStateAction<SubscriptionState>>
  subscriptionState: SubscriptionState
}) => {
  return (
    <Box padding="24px" width="50%">
      <Box>
        <Image src="/IMG.png" alt="#" height={185} width={300} />
      </Box>
      <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          Notifications From PancakeSwap
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          Get started with notifications from WalletConnect. Click the subscribe button below and accept.
        </Text>
        <OnboardingButton subscriptionState={subscriptionState} setSubscriptionState={setSubscriptionState} />
      </FlexGap>
    </Box>
  )
}

export default SubscribedView
