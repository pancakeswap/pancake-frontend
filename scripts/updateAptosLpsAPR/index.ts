import fs from 'fs'
import os from 'os'
import fetch from 'node-fetch'
import BigNumber from 'bignumber.js'
import chunk from 'lodash/chunk'
import { ChainId, Pair } from '@pancakeswap/aptos-swap-sdk'
import { getFarmConfig } from '../../apps/aptos/config/constants/farms'

interface AprMap {
  [key: string]: BigNumber
}

interface SingleFarmResponse {
  id: string
  reserveUSD: string
  volumeUSD: string
}

interface UsdListType {
  volumeUSD: string
  reserveUSD: string
}

interface FarmsOneWeekData {
  [key: string]: {
    updateDate: string
    usdList: UsdListType[]
  }
}

const CAKE_PID = 0
const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429
const FETCH_URL = 'https://api.coinmarketcap.com/dexer/v3/platformpage/pair-pages'

const fetchFarmLpsInfo = async (addresses: string[]): Promise<SingleFarmResponse[]> => {
  const allPairs: any = []
  const maxLoop = 20 // 50 * 20 = max get 1000 pair
  for (let i = 0; i < maxLoop; i++) {
    const offset = i === 0 ? 1 : 50 * i + 1
    const params = `?platform-id=141&dexer-id=4788&sort-field=volumeUsd24h&category=spot&operation=next&desc=true&offset=${offset}`
    // eslint-disable-next-line no-await-in-loop
    const result = await (await fetch(`${FETCH_URL}${params}`)).json()

    if (result.data.pageList.length > 0) {
      allPairs.push(...(result?.data?.pageList || []))
    }

    if (!result.data.hasNextPage) {
      break
    }
  }

  return addresses.map((address): SingleFarmResponse => {
    // eslint-disable-next-line array-callback-return, consistent-return
    const farmPriceInfo = allPairs.find((pair) => {
      const token = pair.quotoTokenAddress.toLowerCase()
      const quoteToken = pair.baseTokenAddress.toLowerCase()
      const [address0, address1] = Pair.parseType(address)
      if ((address0 === quoteToken && address1 === token) || (address0 === token && address1 === quoteToken)) {
        return pair
      }
    })

    return {
      id: address,
      volumeUSD: farmPriceInfo?.volumeUsd24h || '0',
      reserveUSD: farmPriceInfo?.liquidity || '0',
    }
  })
}

const fetchFarmsOneWeekAgo = async (farmsAtLatestBlock: SingleFarmResponse[]) => {
  const currentDate: string = new Date().toISOString().split('T')[0]
  const response: FarmsOneWeekData = (await import('./farmsOneWeekAgo.json')).default

  let newDate = {}
  farmsAtLatestBlock.forEach((farm) => {
    if (response[farm.id]) {
      if (response[farm.id].updateDate !== currentDate) {
        const isMoreThanAWeek = response[farm.id].usdList.length >= 7
        const usdList = [...(response[farm.id]?.usdList || [])]

        if (isMoreThanAWeek) {
          usdList.shift()
        }

        usdList.push({ volumeUSD: farm.volumeUSD, reserveUSD: farm.reserveUSD })

        newDate = {
          ...newDate,
          [farm.id]: { updateDate: currentDate, usdList },
        }
      }
    } else {
      newDate = {
        ...newDate,
        [farm.id]: {
          updateDate: currentDate,
          usdList: [{ volumeUSD: farm.volumeUSD, reserveUSD: farm.reserveUSD }],
        },
      }
    }
  })

  // Save to farmsOneWeekAgo.json
  const hasNewData = Object.keys(newDate).length > 0
  if (hasNewData) {
    fs.writeFile(`scripts/updateAptosLpsAPR/farmsOneWeekAgo.json`, JSON.stringify(newDate, null, 2) + os.EOL, (err) => {
      if (err) throw err
      console.info(` ✅ - farmsOneWeekAgo.json has been updated!`)
    })
  }

  const responseData = hasNewData ? newDate : response
  return Object.keys(responseData)?.map((address: string): SingleFarmResponse => {
    let volumeUSD = '0'
    let reserveUSD = '0'
    const { usdList } = responseData[address]

    if (usdList.length > 0) {
      volumeUSD = usdList.reduce((sum, single) => new BigNumber(sum).plus(single.volumeUSD).toNumber(), 0).toString()
      reserveUSD = usdList.reduce((sum, single) => new BigNumber(sum).plus(single.reserveUSD).toNumber(), 0).toString()
    }
    return { id: address, volumeUSD, reserveUSD }
  })
}

const getAprsForFarmGroup = async (addresses: string[]): Promise<any> => {
  try {
    const farmsAtLatestBlock = await fetchFarmLpsInfo(addresses)
    const farmsOneWeekAgo = await fetchFarmsOneWeekAgo(farmsAtLatestBlock)

    const aprs: AprMap = farmsAtLatestBlock.reduce((aprMap, farm) => {
      const farmWeekAgo = farmsOneWeekAgo.find((oldFarm) => oldFarm.id === farm.id)
      // In case farm is too new to estimate LP APR (i.e. not returned in farmsOneWeekAgo query) - return 0
      let lpApr = new BigNumber(0)
      if (farmWeekAgo) {
        const volume7d = new BigNumber(farmWeekAgo.volumeUSD)
        const lpFees7d = volume7d.times(LP_HOLDERS_FEE)
        const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)
        // Some untracked pairs like KUN-QSD will report 0 volume
        if (lpFeesInAYear.gt(0)) {
          const liquidity = new BigNumber(farm.reserveUSD)
          lpApr = lpFeesInAYear.times(100).dividedBy(liquidity)
        }
      }
      return {
        ...aprMap,
        [farm.id]: lpApr.decimalPlaces(2).toNumber(),
      }
    }, {})
    return aprs
  } catch (error) {
    throw new Error(`Failed to fetch LP APR data: ${error}`)
  }
}

const fetchAndUpdateAptosLPsAPR = async () => {
  const farmsConfig = getFarmConfig(ChainId.MAINNET).filter((i) => i.pid !== CAKE_PID)

  const lowerCaseAddresses = farmsConfig.map((farm) => farm.lpAddress.toLowerCase())
  console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks of 30 addresses to avoid gateway timeout
  const addressesInGroups = chunk(lowerCaseAddresses, 30)

  let allAprs: AprMap = {}
  for await (const groupOfAddresses of addressesInGroups) {
    const aprs = await getAprsForFarmGroup(groupOfAddresses)
    allAprs = { ...allAprs, ...aprs }
  }

  fs.writeFile(`apps/aptos/config/constants/lpAprs/1.json`, JSON.stringify(allAprs, null, 2) + os.EOL, (err) => {
    if (err) throw err
    console.info(` ✅ - lpAprs.json has been updated!`)
  })
}

fetchAndUpdateAptosLPsAPR()
