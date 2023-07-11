import { providers } from 'ethers'

import { FC, useCallback, useEffect, useState } from 'react'
//     import PushSubscription from "../components/PushSubscription";
import { Box, Button, CircleLoader, Flex, FlexGap, Grid, Spinner, Text } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import { shortenAddress } from 'views/V3Info/utils'
import Image from 'next/image'
import { DappClient } from "@walletconnect/push-client"
import { useWalletConnectClient } from 'contexts/PushContext'
import PushSubscription from '../PushSubscription/PushSubscription'
import { cakeBnbLpBalanceStrategy } from 'views/Voting/strategies'
import { useNativeBalances } from 'state/wallet/hooks'
import useAuth from 'hooks/useAuth'
import { Connector, useConnect } from 'wagmi'

interface IPushSubscriptionProps {
      account: string;
      handleSubscribe: any
      handleUnSubscribe: any
      isSubscribed: any;
      isUnsubscribing: any
      isSubscribing: any
      connector: any
    }
    
    const SignedInView: FC<IPushSubscriptionProps> = ({ account, connector, handleSubscribe, handleUnSubscribe, isSubscribed, isSubscribing, isUnsubscribing }) => {
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

  const onSignOut = useCallback(() => {
     connector.connectWithAuthClient()
  }, [connector])

  return (
    <Box className="bg-secondary" borderRadius="28px" padding="2em">
      <FlexGap flexDirection="column" gap="5">
        <FlexGap justifyContent="space-between" gap="10">
          <Grid
            borderRadius="100%"
            width="6em"
            height="6em"
            className="bg-qr"
            border="solid 1px #585F5F"
            //     placeItems="center"
            alignItems='center'
            backgroundPosition="center"
            backgroundSize="contain"
          >
                        <Image src="/images/chains/1.png" alt="ETH" width={112} height={112} />

          </Grid>
          <FlexGap
            padding="16px"
            border="solid 1px"
            borderColor='textSubtle'
            borderRadius="12px"
            height="min-content"
            className="bg-qr"
            alignItems="center"
            gap="0.5em"
          >
            <Box
              width="0.75em"
              height="0.75em"
              backgroundColor="#2BEE6C"
              borderRadius="100%"
            />
            <span>Connected</span>
          </FlexGap>
        </FlexGap>
        <Flex flexDirection="column" paddingY='12px'>
          <Text fontWeight="800" fontSize="1.5em">
            {account ? shortenAddress(account, 5) : null}
          </Text>
          {account ? <PushSubscription 
           handleSubscribe={handleSubscribe}
           handleUnSubscribe={handleUnSubscribe}
           isSubscribed={isSubscribed}
           isSubscribing ={isSubscribing}
           isUnsubscribing={isUnsubscribing}
          account={`${account}`}/> : null}
        </Flex>
        <Divider />
        <Flex
          justifyContent="space-between"
          //   fontSize="1.5em"

          alignItems="center"
        >
          <Text>Balance</Text>
          {/* {!nativeBalance[strippedAddress] ? (
            <CircleLoader />
          ) : (
            <Flex alignItems="center">
              <Image src="/images/chains/1.png" alt="ETH" width={18} height={18} />
              <Text pl='6px'>{nativeBalance[strippedAddress].toFixed(4)} ETH</Text>
            </Flex>
          )} */}
        </Flex>
        <Flex width="100%" justifyContent="center" pt='8px'>
          <Button width="100%" className="wc-button" padding="1.5em" onClick={onSignOut}>
            Sign Out
          </Button>
        </Flex>
      </FlexGap>
    </Box>
  )
}

export default SignedInView
