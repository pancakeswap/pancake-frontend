import { providers } from 'ethers'

import { useCallback, useEffect, useState } from 'react'
//     import PushSubscription from "../components/PushSubscription";
import { Box, Button, CircleLoader, Flex, FlexGap, Grid, Spinner, Text } from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import { shortenAddress } from 'views/V3Info/utils'
import Image from 'next/image'
import PushSubscription from '../PushSubscription/PushSubscription'
import { DappClient } from "@walletconnect/push-client"

const SignedInView: React.FC<{ address: string, pushClient: DappClient }> = ({ address, pushClient }) => {
  const [balance, setBalance] = useState<number>()
  const [avatar, setAvatar] = useState<string | null>()
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const innerEffect = async (addr: string) => {
      setLoading(true)
      const provider = new providers.JsonRpcProvider(
        `https://rpc.walletconnect.com/v1/?chainId=eip155:1&projectId=${'b17e985d352edb85a883b417e4632214'}`,
      )

      try {
        const avatarr = await provider.getAvatar(addr)
        const balancee = await provider.getBalance(addr)
        setAvatar(avatarr)
        setBalance(balancee.toNumber())
      } catch (error) {
        setBalance(0)
        console.log({ error })
      }

      setLoading(false)
    }
    if (address) {
      innerEffect(address)
    }
  }, [setBalance, address])

  const onSignOut = useCallback(() => {
    window.location.reload()
  }, [])

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
            {address ? shortenAddress(address, 5) : null}
          </Text>
          {address ? <PushSubscription account={`eip155:1:${address}`} pushClient={pushClient}/> : null}
        </Flex>
        <Divider />
        <Flex
          justifyContent="space-between"
          //   fontSize="1.5em"

          alignItems="center"
        >
          <Text>Balance</Text>
          {isLoading ? (
            <CircleLoader />
          ) : (
            <Flex alignItems="center">
              <Image src="/images/chains/1.png" alt="ETH" width={18} height={18} />
              <Text pl='6px'>{balance} ETH</Text>
            </Flex>
          )}
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
