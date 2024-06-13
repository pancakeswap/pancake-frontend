import { ChainId, getChainName } from '@pancakeswap/chains'
import { SerializedFarmConfig } from '@pancakeswap/farms'
import fs from 'fs'
import os from 'os'

import { fetchV2FarmsAvgInfo, fetchStableFarmsAvgInfo, type AvgInfo } from '../apps/web/src/queries/farms'

interface AprMap {
  [key: string]: number
}

const FETCH_CHAIN_ID = [ChainId.BSC, ChainId.ETHEREUM]
const fetchAndUpdateLPsAPR = async () => {
  Promise.all(
    FETCH_CHAIN_ID.map(async (chainId) => {
      const [v2Aprs, stableAprs] = await Promise.allSettled([
        fetchV2FarmsAvgInfo(chainId),
        fetchStableFarmsAvgInfo(chainId),
      ])
      const getAprs = (aprRes: { [key: string]: Pick<AvgInfo, 'apr7d'> }): AprMap => {
        const map: AprMap = {}
        const addresses = Object.keys(aprRes)
        for (const addr of addresses) {
          const apr = aprRes[addr]
          if (!apr) {
            continue
          }
          const { apr7d } = apr
          map[addr] = apr7d.times(100).decimalPlaces(5).toNumber()
        }
        return map
      }
      const aprs = {
        ...(v2Aprs.status === 'fulfilled' ? getAprs(v2Aprs.value) : {}),
        ...(stableAprs.status === 'fulfilled' ? getAprs(stableAprs.value) : {}),
      }

      fs.writeFile(
        `apps/web/src/config/constants/lpAprs/${chainId}.json`,
        JSON.stringify(aprs, null, 2) + os.EOL,
        (err) => {
          if (err) throw err
          console.info(` ✅ - lpAprs.json has been updated!`)
        },
      )
    }),
  )
}

let logged = false
export const getFarmConfig = async (chainId: ChainId) => {
  const chainName = getChainName(chainId)
  try {
    return (await import(`../packages/farms/constants/${chainName}`)).default.filter(
      (f: SerializedFarmConfig) => f.pid !== null,
    ) as SerializedFarmConfig[]
  } catch (error) {
    if (!logged) {
      console.error('Cannot get farm config', error, chainId, chainName)
      logged = true
    }
    return []
  }
}

fetchAndUpdateLPsAPR()
