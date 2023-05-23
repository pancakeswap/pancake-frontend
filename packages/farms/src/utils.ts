import { FarmV3Data } from './types'

export function isActiveV3Farm(farm: FarmV3Data, poolLength: number) {
  return farm.pid !== 0 && farm.multiplier !== '0X' && poolLength && poolLength >= farm.pid
}
