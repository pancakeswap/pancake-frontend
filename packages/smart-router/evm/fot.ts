import { ChainId } from '@pancakeswap/chains'
import { WNATIVE } from '@pancakeswap/sdk'
import { Address, PublicClient, getContract } from 'viem'
import { feeOnTransferDetectorAbi } from './abis/FeeOnTransferDetector'

export const feeOnTransferDetectorAddresses = {
  [ChainId.ZKSYNC]: '0xED87D01674199355CEfC05648d17E037306d7962',
  [ChainId.ZKSYNC_TESTNET]: '0x869505373d830104130F95c1E7d578dE7E58C0a8',
} as const

const getFeeOnTransferDetectorContract = <TPublicClient extends PublicClient>(publicClient: TPublicClient) => {
  if (publicClient.chain && publicClient.chain.id in feeOnTransferDetectorAddresses) {
    return getContract({
      abi: feeOnTransferDetectorAbi,
      address: feeOnTransferDetectorAddresses[publicClient.chain.id as keyof typeof feeOnTransferDetectorAddresses],
      publicClient,
    })
  }

  return null
}

const AMOUNT = 100000n

export async function fetchTokenFeeOnTransfer<TPublicClient extends PublicClient>(
  publicClient: TPublicClient,
  tokenAddress: Address,
) {
  if (!publicClient.chain) {
    throw new Error('Chain not found')
  }

  const contract = getFeeOnTransferDetectorContract(publicClient)
  const baseToken = WNATIVE[publicClient.chain.id as keyof typeof WNATIVE]
  if (!contract) {
    throw new Error('Fee on transfer detector contract not found')
  }
  if (!baseToken) {
    throw new Error('Base token not found')
  }

  if (tokenAddress.toLowerCase() === baseToken.address.toLowerCase()) {
    throw new Error('Token is base token')
  }

  return contract.simulate.validate([tokenAddress, baseToken.address, AMOUNT])
}

export async function fetchTokenFeeOnTransferBatch<TPublicClient extends PublicClient>(
  publicClient: TPublicClient,
  tokens: {
    address: Address
  }[],
) {
  if (!publicClient.chain) {
    throw new Error('Chain not found')
  }

  const contract = getFeeOnTransferDetectorContract(publicClient)

  if (!contract) {
    throw new Error('Fee on transfer detector contract not found')
  }

  const baseToken = WNATIVE[publicClient.chain.id as keyof typeof WNATIVE]
  if (!baseToken) {
    throw new Error('Base token not found')
  }

  const tokensWithoutBaseToken = tokens.filter(
    (token) => token.address.toLowerCase() !== baseToken.address.toLowerCase(),
  )

  return publicClient.multicall({
    allowFailure: true,
    contracts: tokensWithoutBaseToken.map(
      (token) =>
        ({
          address: contract.address,
          abi: contract.abi,
          functionName: 'validate',
          args: [token.address, baseToken.address, AMOUNT],
        } as const),
    ),
  })
}
