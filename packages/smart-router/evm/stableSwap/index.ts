import { getLPOutputWithoutFee } from './getLPOutputWithoutFee'
import { getLPOutput } from './getLPOutput'
import { getD } from './amm'

export * from './utils'

export const StableSwap = {
  getLPOutputWithoutFee,
  getLPOutput,
  getD,
}
