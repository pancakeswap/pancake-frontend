import { BitcoinNetwork, BitcoinOTA, BitcoinProvider, EVMWallet } from '@catalogfi/wallets'
import { GardenJS } from '@gardenfi/core'
import { Chains, Orderbook } from '@gardenfi/orderbook'
import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { BrowserProvider, JsonRpcSigner } from 'ethersv6'
import { useEffect } from 'react'
import { useBTCGardenActionHandlers } from 'state/btcGarden/hooks'
import { useChainId, useConnectorClient } from 'wagmi'

export const useSetupBtcGarden = () => {
  const chainId = useChainId()
  const { onSetGarden } = useBTCGardenActionHandlers()
  const { data: client } = useConnectorClient({ chainId })

  const queryResult = useQuery({
    queryKey: ['btc-wallets-query', client],
    queryFn: async (): Promise<{
      userSigner: JsonRpcSigner
      orderbook: Orderbook
      bitcoinWallet: BitcoinOTA
      garden: GardenJS
    }> => {
      if (!client) {
        throw new Error('BTC Garden: client is required')
      }
      const { account, chain, transport } = client

      if (![ChainId.ARBITRUM_ONE, ChainId.ETHEREUM].includes(chain.id)) {
        throw new Error('Unsupported Garden Bridge network')
      }

      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }
      const userProvider = new BrowserProvider(transport, network)
      const userSigner = new JsonRpcSigner(userProvider, account.address)
      const btcNetwork = BitcoinNetwork.Mainnet
      const bitcoinProvider = new BitcoinProvider(btcNetwork)

      const orderbook = await Orderbook.init({
        signer: userSigner,
        opts: {
          domain: (window as any).location.host,
          store: localStorage,
        },
      })

      const wallets = {
        [Chains.bitcoin]: new BitcoinOTA(bitcoinProvider, userSigner),
        [Chains.ethereum]: new EVMWallet(userSigner),
      }

      const garden = new GardenJS(orderbook, wallets)

      return { userSigner, orderbook, bitcoinWallet: wallets[Chains.bitcoin], garden }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(client),
  })

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      onSetGarden(queryResult.data.garden, queryResult.data.bitcoinWallet)
    }
  }, [queryResult.isSuccess, queryResult.data, onSetGarden])
}
