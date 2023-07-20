import { BottomDrawer, Flex, Modal, ModalV2, Text, useMatchBreakpoints, useToast } from '@pancakeswap/uikit'
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
import SignClient from "@walletconnect/sign-client";
import { Metadata, Namespace, UniversalProvider } from '@walletconnect/universal-provider'

import { DappClient } from "@walletconnect/push-client";

    import { Core } from "@walletconnect/core";
import SubscribedView from './components/SubscribeView/SubscribeView';
import SettingsModal from './components/NotificationView/NotificationView';
import EthereumProvider from 'utils/EthereumProvider2';
import { useTranslation } from '@pancakeswap/localization';
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
  const [client, setClient] = useState<EthereumProvider>()
    const { toastSuccess, toastError } = useToast()
const { t } = useTranslation()
  

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false)

    const onSignInWithSign = useCallback(async () => {
    if (!client) return;
    try {
      const signRes = await client.signer.client.connect({
        // Optionally: pass a known prior pairing (e.g. from `signClient.core.pairing.getPairings()`) to skip the `uri` step.
        // Provide the namespaces and chains (e.g. `eip155` for EVM-based chains) we want to use in this session.
        requiredNamespaces: {
          eip155: {
            methods: [
              "eth_sendTransaction",
              "eth_signTransaction",
              "eth_sign",
              "personal_sign",
              "eth_signTypedData",
            ],
            chains: ["eip155:1"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });
      const { uri, approval } = signRes;
      if (uri) {
        client.modal.openModal({ uri });
        // Await session approval from the wallet.
        const session = await approval();
        // Handle the returned session (e.g. update UI to "connected" state).
        // * You will need to create this function *
        // setAddress(session.namespaces.eip155.accounts[0].split(":")[2]);
        // Close the QRCode modal in case it was open.
        client.modal.closeModal();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [client]);



  const handleSubscribe = useCallback(async () => {
    setIsSubscribing(true)
    console.log('shdf')
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      // Resolve known pairings from the Core's Pairing API.
      // console.log(p)
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
        account: `eip155:1:${account}`,
        pairingTopic: latestPairing.topic,
      })

      if (!id) {
        throw new Error('Subscription request failed', {
          cause: 'Push propose failed',
        })
      }
      toastSuccess(
        `${t('Subscription Request')}!`,
        <Text>
          {t('The subscription request has been sent to your wallet')}
        </Text>
      )
      setIsSubscribed(true)
      setIsSubscribing(false)
    } catch (error) {
      setIsSubscribing(false)
      if (error instanceof Error) {
        toastError(
          `${t('Subscription Request eError')}!`,
          <Text>
            {t(error.message)}
          </Text>,
        )
      }
    }
  }, [pushClient, account, toastSuccess, toastError])


  const handleUnSubscribe = useCallback(async () => {
    setIsUnsubscribing(true)
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }
      const pushSubscriptions = pushClient.getActiveSubscriptions()
      console.log(pushSubscriptions)
      const currentSubscription = Object.values(pushSubscriptions).find(
        (sub) => sub.account === `eip155:1:${account}`,
      )

      if (currentSubscription) {
        await pushClient.deleteSubscription({
          topic: currentSubscription.topic,
        })

        setIsUnsubscribing(false)
        setIsSubscribed(false)
        toastSuccess(
          `${t('Unsubscribed')}!`,
          <Text>
            {t('You unsubscribed from gm notification')}
          </Text>
        )
      }
    } catch (error) {

      setIsUnsubscribing(false)
      console.error({ unsubscribeError: error })
      if (error instanceof Error) {
        toastError(
          `${t('Subscription Request eError')}!`,
          <Text>
            {t(error.message)}
          </Text>,
        )
      }
    }
  }, [setIsSubscribed, pushClient, account,  toastSuccess, toastError])

  const createClient = useCallback(async () => {
    const x = await connector.getProvider()
    if (!x) return

    setPushClient(x.pushClient)
    setAuthClient(x.authClient)
    setClient(x)
  }, [connector])

  useEffect(() => {
      if (!connector) return
    if (!pushClient || !authClient) {
      createClient()
    }
  }, [pushClient, createClient, authClient, connector])

  useEffect(() => {
    if (!pushClient) {
      return
    }
    const x = pushClient.subscriptions.getAll()
    const activeSubscriptions = pushClient?.getActiveSubscriptions()
    if (
      Object.values(activeSubscriptions).some(
        (sub) => sub.account === `eip155:1:${account}`,
      )
    ) {
      setIsSubscribed(true)
    }
  }, [pushClient, account]) 

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
             renew={onSignInWithSign}
            account={account} />}
            {/* <SubscribedView/> */}
            {/* <SettingsModal/> */}
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}

// import { BottomDrawer, Flex, Modal, ModalV2, useMatchBreakpoints } from '@pancakeswap/uikit'
// import { AppBody } from 'components/App'
// import { useCallback, useContext, useEffect, useState } from 'react'
// import AuthClient, { generateNonce } from "@walletconnect/auth-client";
// // import { Web3Modal } from "@web3modal/standalone";
// import { useWalletConnectClient } from 'contexts/PushContext'
// import { useChainData } from 'contexts/ChainDataContext';
// import Page from '../Page'
// import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../Swap/styles'
// import SignedInView from './components/SignedInForm/SignedInForm'
// import DefaultView from './components/DefaultView/DefaultView';
// import { useAccount } from 'wagmi';
// import { DEFAULT_EIP155_METHODS, DEFAULT_EIP155_OPTIONAL_METHODS } from './utils/constants';
// import { AccountAction } from './helpers';
// // import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


// // 1. Get projectID at https://cloud.walletconnect.com
// const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
// if (!projectId) {
//   throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
// }

// // 2. Configure web3Modal
// // const web3Modal = new Web3Modal({
// //   projectId,
// //   walletConnectVersion: 2,
// //   standaloneChains: ["eip155:1"],
// // });

// export default function Notifications() {
//   const { connector, isConnected, address: account } = useAccount()
  

//   return (
//     <Page>
//       <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
//         {/* {isDesktop && (
//           <HotTokenList handleOutputSelect={handleOutputSelect} />
//         )} */}
//         <Flex flexDirection="column">
//           <StyledSwapContainer $isChartExpanded={false}>
//             <StyledInputCurrencyWrapper>
//               <AppBody>
//             {account && <SignedInView strippedAddress={account} />}
//               </AppBody>
//             </StyledInputCurrencyWrapper>
//           </StyledSwapContainer>
//         </Flex>
//       </Flex>
//     </Page>
//   )
// }
