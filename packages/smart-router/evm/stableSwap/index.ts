import { getLPOutputWithoutFee } from './getLPOutputWithoutFee'
import { getLPOutput } from './getLPOutput'
import { getSwapOutput, getSwapOutputWithoutFee, getSwapInput, getSwapInputWithtouFee } from './getSwapOutput'
import { getD } from './amm'

export const StableSwap = {
  getSwapInput,
  getSwapInputWithtouFee,
  getSwapOutput,
  getSwapOutputWithoutFee,
  getLPOutputWithoutFee,
  getLPOutput,
  getD,
}
