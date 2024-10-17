/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { ChainId } from '@pancakeswap/chains'
import fs from 'fs'
import path from 'path'
import lpHelpers1 from '../constants/priceHelperLps/1'
import lpHelpers56 from '../constants/priceHelperLps/56'
import { fetchUniversalFarms } from '../src/fetchUniversalFarms'

const chains = [
  [1, fetchUniversalFarms(ChainId.ETHEREUM), lpHelpers1],
  [56, fetchUniversalFarms(ChainId.BSC), lpHelpers56],
]

export const saveList = async () => {
  console.info('save farm config...')
  try {
    fs.mkdirSync(`${path.resolve()}/lists`)
    fs.mkdirSync(`${path.resolve()}/lists/priceHelperLps`)
  } catch (error) {
    //
  }

  for (const [chain, farmPromise, lpHelper] of chains) {
    console.info('Starting build farm config', chain)
    const farm = await farmPromise
    const farmListPath = `${path.resolve()}/lists/${chain}.json`
    const stringifiedList = JSON.stringify(farm, null, 2)
    fs.writeFileSync(farmListPath, stringifiedList)
    console.info('Farm list saved to ', farmListPath)

    const lpPriceHelperListPath = `${path.resolve()}/lists/priceHelperLps/${chain}.json`
    const stringifiedHelperList = JSON.stringify(lpHelper, null, 2)
    fs.writeFileSync(lpPriceHelperListPath, stringifiedHelperList)
    console.info('Lp list saved to ', lpPriceHelperListPath)
  }
}

saveList()
