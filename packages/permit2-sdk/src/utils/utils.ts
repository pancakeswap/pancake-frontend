import { BigintIsh, Token } from '@pancakeswap/sdk'
import { PermitSingle } from '../allowanceTransfer'
import { MaxAllowanceTransferAmount, PERMIT_EXPIRATION, PERMIT_SIG_EXPIRATION } from '../constants'

interface Permit extends PermitSingle {
  sigDeadline: string
}

export const toDeadline = (expiration: number): number => {
  // @FIXME: @ChefJerry remove after test
  // @ts-ignore
  const now = window.nowBlockTimestamp ?? Date.now()
  return Math.floor((now + expiration) / 1000)
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
