import { masterChefV3ABI, NFT_POSITION_MANAGER_ADDRESSES } from '@pancakeswap/v3-sdk'
import { getMasterChefV3Address } from 'utils/addressHelpers'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'

/**
 * Get all token ids of a given account
 * including farming and non-farming token ids
 *
 * @param chainId target chain id
 * @param account target account address
 * @returns
 */
export const getAccountV3TokenIds = async (chainId: number, account: Address) => {
  const masterChefV3Address = getMasterChefV3Address(chainId)
  const nftPositionManagerAddress = NFT_POSITION_MANAGER_ADDRESSES[chainId]

  const [farmingTokenIds, nonFarmTokenIds] = await Promise.all([
    getAccountV3TokenIdsFromContract(chainId, account, masterChefV3Address),
    getAccountV3TokenIdsFromContract(chainId, account, nftPositionManagerAddress),
  ])

  return {
    farmingTokenIds,
    nonFarmTokenIds,
  }
}

export const getAccountV3TokenIdsFromContract = async (
  chainId: number,
  account: Address,
  contractAddress: Address | undefined | null,
) => {
  const client = publicClient({ chainId })

  if (!contractAddress || !account || !client) {
    return []
  }

  const balance = await client.readContract({
    abi: masterChefV3ABI,
    address: contractAddress,
    functionName: 'balanceOf',
    args: [account] as const,
  })

  const tokenCalls = Array.from({ length: Number(balance) }, (_, i) => {
    return {
      abi: masterChefV3ABI,
      address: contractAddress,
      functionName: 'tokenOfOwnerByIndex',
      args: [account, i] as const,
    } as const
  })

  const tokenIds = await client.multicall({
    contracts: tokenCalls,
    allowFailure: false,
  })

  return tokenIds
}
