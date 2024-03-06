import { BigintIsh, Token } from '@pancakeswap/sdk'
import { PermitSingle } from '../allowanceTransfer'
import { MaxAllowanceTransferAmount, PERMIT_EXPIRATION, PERMIT_SIG_EXPIRATION } from '../constants'

// @TODO: remove this type, use `PermitSingle` only
export interface Permit extends PermitSingle {
  sigDeadline: string
}

export const toDeadline = (expiration: number): number => {
  return Math.floor((Date.now() + expiration) / 1000)
}

export const generatePermitTypedData = (token: Token, nonce: BigintIsh, spender: string): Permit => {
  return {
    details: {
      token: token.address,
      amount: MaxAllowanceTransferAmount.toString(),
      expiration: toDeadline(PERMIT_EXPIRATION).toString(),
      nonce: nonce.toString(),
    },
    spender,
    sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION).toString(),
  }
}
