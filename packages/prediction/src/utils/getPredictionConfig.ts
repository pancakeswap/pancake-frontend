import { ChainId, getChainName } from '@pancakeswap/chains'

export const getPredictionConfig = async (chainId?: ChainId): Promise<any> => {
  if (!chainId) {
    return {}
  }

  try {
    const { predictions } = await import(`../constants/config/${getChainName(chainId)}`)
    return predictions
  } catch (e) {
    console.error(e)
    return {}
  }
}
