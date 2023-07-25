import { IfoStatus } from 'config/constants/types'

export const getStatus = (currentBlock: number, startBlock: number, endBlock: number): IfoStatus => {
  // Add an extra check to currentBlock because it takes awhile to fetch so the initial value is 0
  // making the UI change to an inaccurate status
  if (currentBlock === 0) {
    return 'idle'
  }

  if (currentBlock < startBlock) {
    return 'coming_soon'
  }

  if (currentBlock >= startBlock && currentBlock <= endBlock) {
    return 'live'
  }

  if (currentBlock > endBlock) {
    return 'finished'
  }

  return 'idle'
}

export const getStatusByTimestamp = (now: number, startTimestamp?: number, endTimestamp?: number): IfoStatus => {
  if (!startTimestamp || !endTimestamp) {
    return 'idle'
  }

  if (now < startTimestamp) {
    return 'coming_soon'
  }

  if (now >= startTimestamp && now <= endTimestamp) {
    return 'live'
  }

  if (now > endTimestamp) {
    return 'finished'
  }

  return 'idle'
}

export default null
