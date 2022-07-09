import fs from 'fs'
import os from 'os'
import fetch from 'node-fetch'
import { gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { sub } from 'date-fns'
import farmsConfig from '../src/config/constants/farms'
import { bitQueryServerClient } from '../src/utils/graphql'

interface FarmLpsResponse {
  ethereum: {
    dexTrades: {
      smartContract: {
        address: {
          address: string
        }
      }
      tradeAmount: number
    }[]
  }
}

export interface SmartContract {
  address: Address
}

export interface Address {
  address: string
}

interface AprMap {
  [key: string]: BigNumber
}

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const getAprsForFarmGroup = async (addresses: string[], farmData: any[]): Promise<AprMap> => {
  try {
    const {
      ethereum: { dexTrades },
    } = await bitQueryServerClient.request<FarmLpsResponse>(
      gql`
        query lpTrack($timeAfter: ISO8601DateTime, $addresses: [String!]) {
          ethereum(network: bsc) {
            dexTrades(
              exchangeName: { is: "Pancake v2" }
              time: { after: $timeAfter }
              smartContractAddress: { in: $addresses }
            ) {
              smartContract {
                address {
                  address
                }
              }
              tradeAmount(in: USD)
            }
          }
        }
      `,
      { addresses, timeAfter: sub(new Date(), { days: 7 }).toISOString() },
    )

    const aprs: AprMap = dexTrades.reduce((aprMap, farm) => {
      const farmFromInfo = farmData.find(
        (data) => data.lpAddress.toLowerCase() === farm.smartContract.address.address.toLowerCase(),
      )
      // In case farm is too new to estimate LP APR (i.e. not returned in farmsOneWeekAgo query) - return 0
      let lpApr = new BigNumber(0)
      if (farm) {
        const lpFees7d = new BigNumber(farm.tradeAmount).times(LP_HOLDERS_FEE)
        const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)

        // Some untracked pairs like KUN-QSD will report 0 volume
        if (lpFeesInAYear.gt(0) && farmFromInfo) {
          const liquidity = new BigNumber(farmFromInfo.lpTotalSupply)
            .dividedBy(new BigNumber(10).pow(18))
            .times(farmFromInfo.lpTokenPrice)
          lpApr = lpFeesInAYear.times(100).dividedBy(liquidity)
        }
      }
      return {
        ...aprMap,
        [farm.smartContract.address.address.toLowerCase()]: lpApr.decimalPlaces(2).toNumber(),
      }
    }, {})
    return aprs
  } catch (error) {
    throw new Error(`Failed to fetch LP APR data: ${error}`)
  }
}

const fetchAndUpdateLPsAPR = async () => {
  if (!process.env.FARM_API) return
  const v2FarmsData = await (await fetch(process.env.FARM_API)).json()

  const lowerCaseAddresses = farmsConfig.map((farm) => farm.lpAddresses[ChainId.MAINNET].toLowerCase())
  console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks of 30 addresses to avoid gateway timeout
  const addressesInGroups = chunk(lowerCaseAddresses, 30)

  let allAprs: AprMap = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const groupOfAddresses of addressesInGroups) {
    // eslint-disable-next-line no-await-in-loop
    const aprs = await getAprsForFarmGroup(groupOfAddresses, v2FarmsData)
    allAprs = { ...allAprs, ...aprs }
  }

  fs.writeFile(`src/config/constants/lpAprs.json`, JSON.stringify(allAprs, null, 2) + os.EOL, (err) => {
    if (err) throw err
    console.info(` ✅ - lpAprs.json has been updated!`)
  })
}

fetchAndUpdateLPsAPR()
