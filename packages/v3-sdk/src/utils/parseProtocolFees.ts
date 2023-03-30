import { JSBI, Percent } from '@pancakeswap/sdk'

const FEE_BASE = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(4))

export function parseProtocolFees(feeProtocol: number | string) {
  const packed = Number(feeProtocol)
  if (Number.isNaN(packed)) {
    throw new Error(`Invalid fee protocol ${feeProtocol}`)
  }

  const token0ProtocolFee = packed % 2 ** 16
  const token1ProtocolFee = packed >> 16
  return [new Percent(token0ProtocolFee, FEE_BASE), new Percent(token1ProtocolFee, FEE_BASE)]
}
