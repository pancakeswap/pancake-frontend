import { getLPOutputWithoutFee } from './getLPOutputWithoutFee'
import { getLPOutput } from './getLPOutput'
import { getSwapOutput, getSwapOutputWithoutFee } from './getSwapOutput'
import { getD } from './amm'

export * from './utils'

export const StableSwap = {
  getSwapOutput,
  getSwapOutputWithoutFee,
  getLPOutputWithoutFee,
  getLPOutput,
  getD,
}
