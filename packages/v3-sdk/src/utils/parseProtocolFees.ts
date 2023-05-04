import { Percent } from '@pancakeswap/swap-sdk-core'

const FEE_BASE = 10n ** 4n

export function parseProtocolFees(feeProtocol: number | string) {
  const packed = Number(feeProtocol)
  if (Number.isNaN(packed)) {
    throw new Error(`Invalid fee protocol ${feeProtocol}`)
  }

  const token0ProtocolFee = packed % 2 ** 16
  const token1ProtocolFee = packed >> 16
  return [new Percent(token0ProtocolFee, FEE_BASE), new Percent(token1ProtocolFee, FEE_BASE)]
}
