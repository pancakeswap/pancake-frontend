import {
  getRoundBaseFields as getRoundBaseFieldsBNB,
  getBetBaseFields as getBetBaseFieldsBNB,
  getUserBaseFields as getUserBaseFieldsBNB,
} from './bnbQueries'
import {
  getRoundBaseFields as getRoundBaseFieldsCAKE,
  getBetBaseFields as getBetBaseFieldsCAKE,
  getUserBaseFields as getUserBaseFieldsCAKE,
} from './cakeQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'CAKE' ? getRoundBaseFieldsCAKE() : getRoundBaseFieldsBNB()

export const getBetBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'CAKE' ? getBetBaseFieldsCAKE() : getBetBaseFieldsBNB()

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'CAKE' ? getUserBaseFieldsCAKE() : getUserBaseFieldsBNB()
