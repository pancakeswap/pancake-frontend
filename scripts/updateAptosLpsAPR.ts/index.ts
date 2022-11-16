import fs from 'fs'
import os from 'os'
import fetch from 'node-fetch'
import BigNumber from 'bignumber.js'
import chunk from 'lodash/chunk'
import { ChainId, Pair } from '@pancakeswap/aptos-swap-sdk'
import { getFarmConfig } from '../../apps/aptos/config/constants/farms'
import { SingleFarmResponse, AprMap, LP_HOLDERS_FEE, WEEKS_IN_A_YEAR } from '../updateLPsAPR'

const FETCH_URL =
  'https://api.coinmarketcap.com/dexer/v3/dexer/pair-list?base-address=0x1::aptos_coin::AptosCoin&start=1&limit=6&platform-id=141'

const fetchFarmLpsInfo = async (addresses: string[]): Promise<SingleFarmResponse[]> => {
  const infos = await (await fetch(FETCH_URL)).json()
  const infoDataList = infos.data.filter((info) => info.dexerInfo.id === 4788)

  return addresses.map((address): SingleFarmResponse => {
    // eslint-disable-next-line array-callback-return, consistent-return
    const farmPriceInfo = infoDataList.find((info) => {
      const token = info.quoteToken.address.toLowerCase()
      const quoteToken = info.baseToken.address.toLowerCase()
      const [address0, address1] = Pair.parseType(address)
      if (address0 === quoteToken && address1 === token) {
        return info
      }
    })

    return {
      id: address,
      volumeUSD: farmPriceInfo.volume24h || '0',
      reserveUSD: farmPriceInfo.liquidity || '0',
    }
  })
}

const getAprsForFarmGroup = async (addresses: string[]): Promise<any> => {
  try {
    const farmsAtLatestBlock = await fetchFarmLpsInfo(addresses)
    // const farmsOneWeekAgo = await (await import('./farmsOneWeekAgo.json')).default as SingleFarmResponse[]

    // const aprs: AprMap = farmsAtLatestBlock.reduce((aprMap, farm) => {
    //   const farmWeekAgo = farmsOneWeekAgo.find((oldFarm) => oldFarm.id === farm.id)
    //   // In case farm is too new to estimate LP APR (i.e. not returned in farmsOneWeekAgo query) - return 0
    //   let lpApr = new BigNumber(0)
    //   if (farmWeekAgo) {
    //     const volume7d = new BigNumber(farm.volumeUSD).minus(new BigNumber(farmWeekAgo.volumeUSD))
    //     const lpFees7d = volume7d.times(LP_HOLDERS_FEE)
    //     const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)
    //     // Some untracked pairs like KUN-QSD will report 0 volume
    //     if (lpFeesInAYear.gt(0)) {
    //       const liquidity = new BigNumber(farm.reserveUSD)
    //       lpApr = lpFeesInAYear.times(100).dividedBy(liquidity)
    //     }
    //   }
    //   return {
    //     ...aprMap,
    //     [farm.id]: lpApr.decimalPlaces(2).toNumber(),
    //   }
    // }, {})
    // return aprs
  } catch (error) {
    throw new Error(`Failed to fetch LP APR data: ${error}`)
  }
}

const fetchAndUpdateAptosLPsAPR = async () => {
  const farmsConfig = getFarmConfig(ChainId.MAINNET)

  const lowerCaseAddresses = farmsConfig.map((farm) => farm.lpAddress.toLowerCase())
  console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks of 30 addresses to avoid gateway timeout
  const addressesInGroups = chunk(lowerCaseAddresses, 30)

  let allAprs: AprMap = {}
  for await (const groupOfAddresses of addressesInGroups) {
    const aprs = await getAprsForFarmGroup(groupOfAddresses)
    allAprs = { ...allAprs, ...aprs }
  }

  // fs.writeFile(
  //   `apps/aptos/config/constants/lpAprs/1.json`,
  //   JSON.stringify(allAprs, null, 2) + os.EOL,
  //   (err) => {
  //     if (err) throw err
  //     console.info(` ✅ - lpAprs.json has been updated!`)
  //   },
  // )
}

fetchAndUpdateAptosLPsAPR()
