import { Yam } from '../../sushi'

import { bnToDec } from '../../utils'

import {
  getCurrentPrice as gCP,
  getTargetPrice as gTP,
  getCirculatingSupply as gCS,
  getNextRebaseTimestamp as gNRT,
  getTotalSupply as gTS,
  getScalingFactor,
} from '../../sushi/utils'

const getCurrentPrice = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get current YAM price
  return gCP(yam)
}

const getTargetPrice = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get target YAM price
  return gTP(yam)
}

const getCirculatingSupply = async (yam: typeof Yam): Promise<string> => {
  // FORBROCK: get circulating supply
  return gCS(yam)
}

const getNextRebaseTimestamp = async (yam: typeof Yam): Promise<number> => {
  // FORBROCK: get next rebase timestamp
  const nextRebase = (await gNRT(yam)) as number
  return nextRebase * 1000
}

const getTotalSupply = async (yam: typeof Yam): Promise<string> => {
  // FORBROCK: get total supply
  return gTS(yam)
}

export const getStats = async (yam: typeof Yam) => {
  const curPrice = await getCurrentPrice(yam)
  const circSupply = '' // await getCirculatingSupply(yam)
  const nextRebase = await getNextRebaseTimestamp(yam)
  const rawScalingFactor = await getScalingFactor(yam)
  const scalingFactor = Number(bnToDec(rawScalingFactor).toFixed(2))
  const targetPrice = await getTargetPrice(yam)
  const totalSupply = await getTotalSupply(yam)
  return {
    circSupply,
    curPrice,
    nextRebase,
    scalingFactor,
    targetPrice,
    totalSupply,
  }
}
