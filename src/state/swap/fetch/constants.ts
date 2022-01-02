import { INFO_CLIENT } from 'config/constants/endpoints'
import { PairDataTimeWindowEnum } from '../types'

// Specifies the amount of data points to query for specific time window
export const timeWindowIdsCountMapping: Record<PairDataTimeWindowEnum, number> = {
  [PairDataTimeWindowEnum.DAY]: 24,
  [PairDataTimeWindowEnum.WEEK]: 28,
  [PairDataTimeWindowEnum.MONTH]: 30,
  [PairDataTimeWindowEnum.YEAR]: 24,
}

// How many StreamingFast ids to skip when querying the data
export const timeWindowGapMapping: Record<PairDataTimeWindowEnum, number | null> = {
  [PairDataTimeWindowEnum.DAY]: null,
  [PairDataTimeWindowEnum.WEEK]: 6, // Each datapoint 6 hours apart
  [PairDataTimeWindowEnum.MONTH]: 1, // Each datapoint 1 day apart
  [PairDataTimeWindowEnum.YEAR]: 15, // Each datapoint 15 days apart
}

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getHeaders = (endpoint: string) => {
  if (endpoint === INFO_CLIENT) {
    return { 'X-Sf': process.env.NEXT_PUBLIC_SF_HEADER }
  }
  return undefined
}
