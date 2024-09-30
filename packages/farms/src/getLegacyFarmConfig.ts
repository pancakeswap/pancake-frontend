import { ChainId, getChainName } from '@pancakeswap/chains'
import { getStableSwapPools } from '@pancakeswap/stable-swap-sdk'
import { isAddressEqual } from 'viem'
import { supportedChainIdV4 } from './const'
import { SerializedFarmConfig, SerializedFarmPublicData, UniversalFarmConfig } from './types'

/**
 * @deprecated only used for legacy farms
 */
export async function getLegacyFarmConfig(chainId?: ChainId): Promise<SerializedFarmPublicData[]> {
  if (chainId && supportedChainIdV4.includes(chainId as number)) {
    const chainName = getChainName(chainId)
    try {
      const config = await import(`./farms/${chainName}.ts`)
      let universalConfig: UniversalFarmConfig[] = config.default
      // eslint-disable-next-line prefer-destructuring
      const legacyFarmConfig: SerializedFarmConfig[] = config.legacyFarmConfig
      if (legacyFarmConfig && legacyFarmConfig.length > 0) {
        universalConfig = universalConfig.filter((f) => {
          return !!f.pid && !legacyFarmConfig.some((legacy) => isAddressEqual(legacy.lpAddress, f.lpAddress))
        })
      }

      const transformedFarmConfig: SerializedFarmConfig[] = universalConfig
        .filter((f) => f.pid && (f.protocol === 'v2' || f.protocol === 'stable'))
        .map((farm) => {
          const stablePair =
            farm.protocol === 'stable'
              ? getStableSwapPools(chainId).find((s) => {
                  return isAddressEqual(s.lpAddress, farm.lpAddress)
                })
              : undefined
          const bCakeWrapperAddress = 'bCakeWrapperAddress' in farm ? farm.bCakeWrapperAddress : undefined

          return {
            pid: farm.pid ?? 0,
            lpAddress: farm.lpAddress,
            lpSymbol: `${farm.token0.symbol}-${farm.token1.symbol}`,
            token: farm.token0.serialize,
            quoteToken: farm.token1.serialize,
            ...{
              ...(stablePair && {
                stableSwapAddress: stablePair.stableSwapAddress,
                infoStableSwapAddress: stablePair.infoStableSwapAddress,
                stableLpFee: stablePair.stableLpFee,
                stableLpFeeRateOfTotalFee: stablePair.stableLpFeeRateOfTotalFee,
              }),
              ...(bCakeWrapperAddress && { bCakeWrapperAddress }),
            },
          } satisfies SerializedFarmConfig
        })

      return legacyFarmConfig.concat(transformedFarmConfig)
    } catch (error) {
      console.error('Cannot get farm config', error, chainId, chainName)
      return []
    }
  }

  return []
}
