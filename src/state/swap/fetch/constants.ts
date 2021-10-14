import { PairDataTimeWindowEnum } from '../types'

export const timeWindowIdsCountMapping: Record<PairDataTimeWindowEnum, number> = {
  [PairDataTimeWindowEnum.DAY]: 24,
  [PairDataTimeWindowEnum.WEEK]: 28,
  [PairDataTimeWindowEnum.MONTH]: 30,
  [PairDataTimeWindowEnum.YEAR]: 24,
  [PairDataTimeWindowEnum.ALL_TIME]: 24,
}

export const timeWindowGapMapping: Record<PairDataTimeWindowEnum, number | null> = {
  [PairDataTimeWindowEnum.DAY]: null,
  [PairDataTimeWindowEnum.WEEK]: 4,
  [PairDataTimeWindowEnum.MONTH]: 1,
  [PairDataTimeWindowEnum.YEAR]: 15,
  [PairDataTimeWindowEnum.ALL_TIME]: null,
}
