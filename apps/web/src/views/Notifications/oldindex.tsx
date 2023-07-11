import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useCallback, useContext, useEffect, useState } from 'react'
import AuthClient, { generateNonce } from "@walletconnect/auth-client";
// import { Web3Modal } from "@web3modal/standalone";
import { useWalletConnectClient } from 'contexts/PushContext'
import { useChainData } from 'contexts/ChainDataContext';
import Page from '../Page'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../Swap/styles'
import SignedInView from './components/SignedInForm/SignedInForm'
import DefaultView from './components/DefaultView/DefaultView';
import { useAccount } from 'wagmi';
import { DEFAULT_EIP155_METHODS, DEFAULT_EIP155_OPTIONAL_METHODS } from './utils/constants';
import { AccountAction } from './helpers';
import { DappClient } from "@walletconnect/push-client";
    import { Core } from "@walletconnect/core";
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


// 1. Get projectID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

// 2. Configure web3Modal
// const web3Modal = new Web3Modal({
//   projectId,
//   walletConnectVersion: 2,
//   standaloneChains: ["eip155:1"],
// });

export default function Notifications() {
  const { connector, address: account } = useAccount()
  const [pushClient, setPushClient] = useState<DappClient>()
  const [authClient, setAuthClient] = useState<AuthClient>()

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false)

  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      // Resolve known pairings from the Core's Pairing API.
      const pairings = pushClient.core.pairing.getPairings()
      if (!pairings?.length) {
        throw new Error('No pairings found')
      }
      // Use the latest pairing.
      const latestPairing = pairings[pairings.length - 1]
      if (!latestPairing?.topic) {
        throw new Error('Subscription failed', {
          cause: 'pairingTopic is missing',
        })
      }
      const { id } = await pushClient.propose({
        account: `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`,
        pairingTopic: latestPairing.topic,
      })

      if (!id) {
        throw new Error('Subscription request failed', {
          cause: 'Push propose failed',
        })
      }
      console.log(`The subscription request has been sent to your wallet`)
      setIsSubscribed(true)
    } catch (error) {
      setIsSubscribing(false)
      console.error({ subscribeError: error })
      if (error instanceof Error) {
        console.log(`error, ${error.message}`)
      }
    }
  }, [pushClient])

  const handleUnSubscribe = useCallback(async () => {
    setIsUnsubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      const pushSubscriptions = pushClient.getActiveSubscriptions()
      const currentSubscription = Object.values(pushSubscriptions).find(
        (sub) => sub.account === `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`,
      )

      if (currentSubscription) {
        await pushClient.deleteSubscription({
          topic: currentSubscription.topic,
        })

        setIsUnsubscribing(false)
        setIsSubscribed(false)
        console.log(`You unsubscribed from gm notification`)
      }
    } catch (error) {
      setIsUnsubscribing(false)
      console.error({ unsubscribeError: error })
      if (error instanceof Error) {
        console.log(`error, ${error.message}`)
      }
    }
  }, [setIsSubscribed, pushClient])

  const createClient = useCallback(async () => {
    const x = await connector.getProvider()
    if (!x) return

    setPushClient(x.pushClient)
    setAuthClient(x.authClient)
//     setWeb3Modal(web3Modal)
  }, [connector])

  useEffect(() => {
    console.log(connector)
      if (!connector) return
    if (!pushClient || !authClient) {
      createClient()
    }
  }, [pushClient, createClient, authClient, connector])

  useEffect(() => {
    if (!pushClient) {
      return
    }
    const activeSubscriptions = pushClient?.getActiveSubscriptions()
    console.log('activeS', activeSubscriptions)
    if (
      Object.values(activeSubscriptions).some(
        (sub) => sub.account === `eip155:1:0xE05b3E63c1A10fe0B707741aE96e368Dd6EA872d`,
      )
    ) {
      setIsSubscribed(true)
    }
  }, [pushClient])


  

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        {/* {isDesktop && (
          <HotTokenList handleOutputSelect={handleOutputSelect} />
        )} */}
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={false}>
            <StyledInputCurrencyWrapper>
              <AppBody>
            {account && connector && <SignedInView 
            connector={connector}
             handleSubscribe={handleSubscribe}
             handleUnSubscribe={handleUnSubscribe}
             isSubscribed={isSubscribed}
             isSubscribing ={isSubscribing}
             isUnsubscribing={isUnsubscribing}
            strippedAddress={account} />}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
