/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'fs'
import path from 'path'
import bscFarms from '../src/farms/bsc'
import bscTestnetFarms from '../src/farms/bscTestnet'
import ethFarms from '../src/farms/eth'

import lpHelpers1 from '../constants/priceHelperLps/1'
import lpHelpers56 from '../constants/priceHelperLps/56'
import lpHelpers97 from '../constants/priceHelperLps/97'

const chains = [
  [1, ethFarms, lpHelpers1],
  [56, bscFarms, lpHelpers56],
  [97, bscTestnetFarms, lpHelpers97],
]

export const saveList = async () => {
  console.info('save farm config...')
  try {
    fs.mkdirSync(`${path.resolve()}/lists`)
    fs.mkdirSync(`${path.resolve()}/lists/priceHelperLps`)
  } catch (error) {
    //
  }
  for (const [chain, farm, lpHelper] of chains) {
    console.info('Starting build farm config', chain)
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
