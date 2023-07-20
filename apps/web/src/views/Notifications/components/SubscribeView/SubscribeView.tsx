import { providers } from 'ethers'

import { FC, useCallback, useEffect, useState } from 'react'
//     import PushSubscription from "../components/PushSubscription";
import { Box, Button, CircleLoader, Flex, FlexGap, Grid, Heading, Spinner, Text } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import { shortenAddress } from 'views/V3Info/utils'
// import Image from 'next/image'
import { DappClient } from "@walletconnect/push-client"
import { useWalletConnectClient } from 'contexts/PushContext'
import PushSubscription from '../PushSubscription/PushSubscription'
import { cakeBnbLpBalanceStrategy } from 'views/Voting/strategies'
import { useNativeBalances } from 'state/wallet/hooks'
import useAuth from 'hooks/useAuth'
import { Connector, useConnect } from 'wagmi'
import Image from 'next/image'
import { FormContainer } from 'views/Swap/V3Swap/components'
import Heading1Text from 'views/TradingCompetition/components/CompetitionHeadingText'

interface IPushSubscriptionProps {
      account: string;
      handleSubscribe: any
      handleUnSubscribe: any
      isSubscribed: any;
      isUnsubscribing: any
      isSubscribing: any
      connector: any
    }
    
    const SubscribedView = () => {
//   const { disconnect, balances } = useWalletConnectClient()
//   const nativeBalance = useNativeBalances(strippedAddress)
// const { authorisePushSubscribe } = useAuth()
// const{
//       handleSubscribe,
//       handleUnSubscribe,
//       connectWithAuthClient,
//       isSubscribed,
//       isSubscribing,
//       isUnsubscribing,
//     } = useWalletConnectClient()

//   const onSignOut = useCallback(() => {
//      connector.connectWithAuthClient()
//   }, [connector])

  return (
      <Box padding='24px'>
        <Box>
            <Image src={'/IMG.png'} href='#' height={185} width={300}/>
         </Box>
         <FlexGap rowGap='12px' flexDirection='column' justifyContent='center' alignItems='center'>
            <Text fontSize='24px' fontWeight='600' lineHeight='120%' textAlign='center'>Notifications From PancakeSwap</Text>
            <Text fontSize='16px'  textAlign='center' color='textSubtle'>Get started with notifications from WalletConnect. Click the subscribe button below and accept.</Text>
            <Button marginTop='8px' variant='primary' width='100%'>{'Enable (Subscribe in wallet)'}</Button>
         </FlexGap>
      </Box>
  )
}

export default SubscribedView
