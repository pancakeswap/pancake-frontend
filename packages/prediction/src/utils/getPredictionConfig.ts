import { ChainId, getChainName } from '@pancakeswap/chains'
import { PredictionConfig } from '../type'

export const getPredictionConfig = async (chainId?: ChainId): Promise<Record<string, PredictionConfig>> => {
  if (!chainId) {
    return {}
  }

  try {
    const { predictions } = await import(`../constants/predictions/${getChainName(chainId)}`)
    return predictions
  } catch (e) {
    console.error(e)
    return {}
  }
}
