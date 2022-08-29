import nonBscVault from 'config/abi/nonBscVault.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { ChainId } from '@pancakeswap/sdk'

// will return BSC or BSC Testnet chainId
export const getBscChainId = async (chainId: number) => {
  try {
    if (!chainId) {
      return ChainId.BSC
    }

    const calls = [
      {
        name: 'BSC_CHAIN_ID',
        address: getMasterChefAddress(chainId),
      },
    ]
    const [[bscChainId]] = await multicallv2({ abi: nonBscVault, calls, chainId })
    return bscChainId.toNumber()
  } catch (error) {
    console.error('Get BSC Chain Id Error: ', error)
    return ChainId.BSC
  }
}
