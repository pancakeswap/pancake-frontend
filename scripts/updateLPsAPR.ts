import { ChainId, getChainName } from '@pancakeswap/chains'
import { SerializedFarmConfig } from '@pancakeswap/farms'
import fs from 'fs/promises'
import path from 'path'
import { fetchV2FarmsAvgInfo, fetchStableFarmsAvgInfo, type AvgInfo } from '../apps/web/src/queries/farms'
import pLimit from 'p-limit'
import { BigNumber } from 'bignumber.js'

interface AprMap {
  [key: string]: number
}

const FETCH_CHAIN_IDS = [ChainId.BSC, ChainId.ETHEREUM]
const OUTPUT_DIR = path.join(process.cwd(), 'apps', 'web', 'src', 'config', 'constants', 'lpAprs')
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const CONCURRENT_REQUESTS = 5

const limit = pLimit(CONCURRENT_REQUESTS)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getAprs = (aprRes: { [key: string]: Pick<AvgInfo, 'apr7d'> }): AprMap => {
  return Object.entries(aprRes).reduce((map, [addr, apr]) => {
    if (apr?.apr7d) {
      const aprValue = new BigNumber(apr.apr7d).times(100).decimalPlaces(5).toNumber()
      if (!isNaN(aprValue) && isFinite(aprValue)) {
        map[addr] = aprValue
      }
    }
    return map
  }, {} as AprMap)
}

const fetchWithRetry = async <T>(fetchFn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fetchFn()
  } catch (error) {
    if (retries > 0) {
      await sleep(RETRY_DELAY)
      return fetchWithRetry(fetchFn, retries - 1)
    }
    throw error
  }
}

const fetchAndUpdateLPsAPR = async () => {
  const results = await Promise.all(
    FETCH_CHAIN_IDS.map(chainId => 
      limit(async () => {
        try {
          console.log(`Fetching APRs for chain ${chainId}...`)
          const [v2AprsResult, stableAprsResult] = await Promise.all([
            fetchWithRetry(() => fetchV2FarmsAvgInfo(chainId)),
            fetchWithRetry(() => fetchStableFarmsAvgInfo(chainId))
          ])

          const v2Aprs = getAprs(v2AprsResult)
          const stableAprs = getAprs(stableAprsResult)

          const aprs = { ...v2Aprs, ...stableAprs }

          const outputPath = path.join(OUTPUT_DIR, `${chainId}.json`)
          await fs.mkdir(path.dirname(outputPath), { recursive: true })
          await fs.writeFile(outputPath, JSON.stringify(aprs, null, 2) + '\n')

          console.log(`✅ lpAprs.json has been updated for chain ${chainId}!`)
          return { chainId, success: true }
        } catch (error) {
          console.error(`❌ Error updating lpAprs.json for chain ${chainId}:`, error)
          return { chainId, success: false, error }
        }
      })
    )
  )

  const successfulChains = results.filter(r => r.success).map(r => r.chainId)
  const failedChains = results.filter(r => !r.success).map(r => r.chainId)

  console.log(`Successfully updated APRs for chains: ${successfulChains.join(', ')}`)
  if (failedChains.length > 0) {
    console.warn(`Failed to update APRs for chains: ${failedChains.join(', ')}`)
  }
}

const farmConfigCache: { [chainId: number]: SerializedFarmConfig[] } = {}

const getFarmConfig = async (chainId: ChainId): Promise<SerializedFarmConfig[]> => {
  if (farmConfigCache[chainId]) {
    return farmConfigCache[chainId]
  }

  const chainName = getChainName(chainId)
  try {
    const { default: farmConfig } = await import(`../packages/farms/constants/${chainName}`)
    const filteredConfig = farmConfig.filter((f: SerializedFarmConfig) => f.pid !== null)
    farmConfigCache[chainId] = filteredConfig
    return filteredConfig
  } catch (error) {
    console.error(`Cannot get farm config for chain ${chainId} (${chainName}):`, error)
    return []
  }
}

const main = async () => {
  try {
    console.time('Total execution time')
    await fetchAndUpdateLPsAPR()
    console.timeEnd('Total execution time')
    console.log('All LP APRs have been updated successfully.')
  } catch (error) {
    console.error('An unexpected error occurred while updating LP APRs:', error)
  }
}

main()
