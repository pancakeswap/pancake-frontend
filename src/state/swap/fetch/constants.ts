import { PairDataTimeWindowEnum } from '../types'

// Specifies the amount of data points to query for specific time window
export const timeWindowIdsCountMapping: Record<PairDataTimeWindowEnum, number> = {
  [PairDataTimeWindowEnum.DAY]: 24,
  [PairDataTimeWindowEnum.WEEK]: 28,
  [PairDataTimeWindowEnum.MONTH]: 30,
  [PairDataTimeWindowEnum.YEAR]: 24,
}

export const timeWindowGapMapping: Record<PairDataTimeWindowEnum, number | null> = {
  [PairDataTimeWindowEnum.DAY]: null,
  [PairDataTimeWindowEnum.WEEK]: 4,
  [PairDataTimeWindowEnum.MONTH]: 1,
  [PairDataTimeWindowEnum.YEAR]: 15,
}

// Needed on dev environment
export const getHeaders = () => {
  if (process.env.NODE_ENV !== 'production') {
    return { 'X-Sf': process.env.REACT_APP_SF_HEADER }
  }
  return {}
}
