import { ChainId } from '@pancakeswap/chains'
import { WNATIVE } from '@pancakeswap/sdk'
import { Address, PublicClient, getContract } from 'viem'
import { feeOnTransferDetectorAbi } from './abis/FeeOnTransferDetector'

export const feeOnTransferDetectorAddresses = {
  [ChainId.ETHEREUM]: '0xe9200516a475b9e6FD4D1c452858097F345A6760',
  [ChainId.SEPOLIA]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.BSC]: '0x003BD52f589F23346E03fA431209C29cD599d693',
  [ChainId.BSC_TESTNET]: '0xE83BD854c1fBf54424b4d914163BF855aB1131Aa',
  [ChainId.ARBITRUM_ONE]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.ARBITRUM_SEPOLIA]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.POLYGON_ZKEVM]: '0xe9200516a475b9e6FD4D1c452858097F345A6760',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xbc60A0d9536B6F75b1FfE18b47364ED684EA0260',
  [ChainId.BASE]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.BASE_SEPOLIA]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.ZKSYNC]: '0xED87D01674199355CEfC05648d17E037306d7962',
  [ChainId.ZKSYNC_TESTNET]: '0x869505373d830104130F95c1E7d578dE7E58C0a8',
  [ChainId.LINEA]: '0xD8b14F915b1b4b1c4EE4bF8321Bea018E72E5cf3',
  [ChainId.LINEA_TESTNET]: '0x3412378f17B1b44E8bcFD157EcE1a4f59DA5A77a',
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

const AMOUNT = 100_000n

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
