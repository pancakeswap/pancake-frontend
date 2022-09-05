/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import path from 'path'
import fs from 'fs'
import farm1 from '../1'
import farm5 from '../5'
import farm97 from '../97'
import farm56 from '../56'

import lpHelpers1 from '../priceHelperLps/1'
import lpHelpers5 from '../priceHelperLps/5'
import lpHelpers97 from '../priceHelperLps/97'
import lpHelpers56 from '../priceHelperLps/56'

const chains = [
  [1, farm1, lpHelpers1],
  [5, farm5, lpHelpers5],
  [56, farm56, lpHelpers56],
  [97, farm97, lpHelpers97],
]

export const saveList = async () => {
  console.info('save farm config...')
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
