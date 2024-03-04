import { Abi, PublicClient, getContract as viemGetContract } from 'viem'
import { ChainId } from '@pancakeswap/chains'
import { Address, WalletClient } from 'wagmi'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    // TODO: Fix viem
    // @ts-ignore
    publicClient: publicClient ?? viemClients[chainId],
    // TODO: Fix viem
    // @ts-ignore
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}
