import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'

export type BinPool = {
  activeId: bigint
  swapFee: bigint
  reserveOfBin: Record<
    string,
    {
      reserve0: bigint
      reserve1: bigint
    }
  >
}

export const swap = ({
  pool,
  zeroForOne,
  amountIn,
}: {
  pool: BinPool
  zeroForOne: boolean
  amountIn: CurrencyAmount<Currency>
}) => {
  invariant(amountIn.greaterThan(0), 'AMOUNT_IN')

  throw new Error('Not implemented yet')

  // while (true) {
  //   const { reserve0, reserve1 } = pool.reserveOfBin[pool.activeId.toString()]
  //   const reserve = zeroForOne ? reserve0 : reserve1
  //   if (reserve !== 0n) {
  //     const amountOut = zeroForOne ? reserve1 : reserve0
  //     return amountOut
  //   }
  // }
}
