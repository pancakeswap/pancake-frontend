import NoBscVaultAbi from 'config/abi/NoBscVaultAbi.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { ChainId } from '@pancakeswap/sdk'

export const getBscChainId = async (chainId: number) => {
  try {
    const calls = [
      {
        name: 'BSC_CHAIN_ID',
        address: getMasterChefAddress(chainId),
      },
    ]
    const [[bscChainId]] = await multicallv2({ abi: NoBscVaultAbi, calls, chainId })
    return bscChainId
  } catch (error) {
    console.error('Get BSC Chain Id Error: ', error)
    return ChainId.BSC
  }
}
