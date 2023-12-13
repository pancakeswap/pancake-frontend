import { ChainId } from '@pancakeswap/chains'
import { PublicClient, createPublicClient, http, Chain, Client, WalletClient, createWalletClient } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { CHAINS } from './constants/chains'

const account = mnemonicToAccount('test test test test test test test test test test test junk')

const createClients = <TClient extends Client>(chains: Chain[]) => {
  return (type: 'Wallet' | 'Public'): Record<ChainId, TClient> => {
    return chains.reduce((prev, cur) => {
      const clientConfig = { chain: cur, transport: http() }
      const client =
        type === 'Wallet' ? createWalletClient({ ...clientConfig, account }) : createPublicClient(clientConfig)
      return {
        ...prev,
        [cur.id]: client,
      }
    }, {} as Record<ChainId, TClient>)
  }
}

const publicClients = createClients<PublicClient>(CHAINS)('Public')
const walletClients = createClients<WalletClient>(CHAINS)('Wallet')

export const getPublicClient = ({ chainId }: { chainId?: ChainId }) => {
  return publicClients[chainId!]
}

export type Provider = ({ chainId }: { chainId?: ChainId }) => PublicClient

export const getWalletClient = ({ chainId }: { chainId?: ChainId }) => {
  return walletClients[chainId!]
}
