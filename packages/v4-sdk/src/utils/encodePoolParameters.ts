import { concat, encodePacked, pad } from 'viem'
import type { BinPoolParameter, Bytes32, CLPoolParameter } from '../types'
import { encodeHooksRegistration } from './encodeHooksRegistration'

export const encodeCLPoolParameters = (params: CLPoolParameter): Bytes32 => {
  const hooks = encodeHooksRegistration(params?.hooksRegistration)
  const tickSpacing = encodePacked(['int24'], [params.tickSpacing])

  return pad(concat([tickSpacing, hooks]))
}

export const encodeBinPoolParameters = (params: BinPoolParameter): Bytes32 => {
  const hooks = encodeHooksRegistration(params?.hooksRegistration)
  const binStep = encodePacked(['uint16'], [params.binStep])

  return pad(concat([binStep, hooks]))
}

export const encodePoolParameters = (params: CLPoolParameter | BinPoolParameter): Bytes32 => {
  if ('tickSpacing' in params) {
    return encodeCLPoolParameters(params)
  }
  return encodeBinPoolParameters(params)
}
