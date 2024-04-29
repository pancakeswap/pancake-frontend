import { Hex } from 'viem'
import { HooksRegistration } from '../types'

const HOOKS_REGISTRATION_OFFSET: Record<keyof HooksRegistration, number> = {
  beforeInitialize: 0,
  afterInitialize: 1,
  beforeAddLiquidity: 2,
  afterAddLiquidity: 3,
  beforeRemoveLiquidity: 4,
  afterRemoveLiquidity: 5,
  beforeSwap: 6,
  afterSwap: 7,
  beforeDonate: 8,
  afterDonate: 9,
}

export const encodeHooksRegistration = (hooksRegistration?: HooksRegistration): Hex => {
  let registration = 0x0000

  if (hooksRegistration) {
    for (const key in hooksRegistration) {
      if (hooksRegistration[key as keyof HooksRegistration]) {
        // eslint-disable-next-line no-bitwise
        registration |= 1 << HOOKS_REGISTRATION_OFFSET[key as keyof HooksRegistration]
      }
    }
  }

  return `0x${registration.toString(16).padStart(4, '0')}`
}
