import {
  roundBaseFields as roundBaseFieldsBNB,
  betBaseFields as betBaseFieldsBNB,
  userBaseFields as userBaseFieldsBNB,
} from './bnbQueries'
import {
  roundBaseFields as roundBaseFieldsCAKE,
  betBaseFields as betBaseFieldsCAKE,
  userBaseFields as userBaseFieldsCAKE,
} from './cakeQueries'

export const getRoundBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'CAKE' ? roundBaseFieldsCAKE : roundBaseFieldsBNB

export const getBetBaseFields = (tokenSymbol: string) => (tokenSymbol === 'CAKE' ? betBaseFieldsCAKE : betBaseFieldsBNB)

export const getUserBaseFields = (tokenSymbol: string) =>
  tokenSymbol === 'CAKE' ? userBaseFieldsCAKE : userBaseFieldsBNB
