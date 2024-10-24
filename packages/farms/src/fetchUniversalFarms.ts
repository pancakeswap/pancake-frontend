import { ChainId } from '@pancakeswap/chains'
import { ERC20Token } from '@pancakeswap/sdk'
import { FARMS_API } from '../config/endpoint'
import { Protocol, UniversalFarmConfig } from './types'

export const fetchUniversalFarms = async (chainId: ChainId, protocol?: Protocol) => {
  try {
    const params = { chainId, ...(protocol && { protocol }) }
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    const response = await fetch(`${FARMS_API}?${queryString}`)
    const result = await response.json()
    const newData: UniversalFarmConfig[] = result.map((p: any) => ({
      ...p,
      token0: new ERC20Token(
        p.token0.chainId,
        p.token0.address,
        p.token0.decimals,
        p.token0.name,
        p.token0.symbol,
        p.token0.projectLink,
      ),
      token1: new ERC20Token(
        p.token1.chainId,
        p.token1.address,
        p.token1.decimals,
        p.token1.name,
        p.token1.symbol,
        p.token1.projectLink,
      ),
    }))

    return newData
  } catch (error) {
    return []
  }
}
