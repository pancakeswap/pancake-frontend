import { BigintIsh, Currency } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { Address } from 'viem'
import { MAX_BIN_STEP, MIN_BIN_STEP } from '../../constants'
import { TEN_PERCENT_FEE } from '../../constants/fee'
import type { BinTree } from '../../types'
import { getSortedCurrencies } from '../../utils/getSortedCurrencies'

type ActiveId = number | `${number}`
type Reserve = {
  reserveX: bigint
  reserveY: bigint
}

export type BinPoolState = {
  currencyX: Currency
  currencyY: Currency
  binStep: bigint
  activeId: bigint
  reserveOfBin: Record<ActiveId, Reserve>
  swapFee: bigint
  protocolFee: bigint
  lmPool?: Address
  tree?: BinTree
}

/**
 * Returns a new BinPoolState object
 */
export const getBinPool = ({
  currencyA,
  currencyB,
  activeId,
  binStep,
  swapFee,
  protocolFee,
  lmPool,
  tree,
  reserveOfBin,
}: {
  currencyA: Currency
  currencyB: Currency
  activeId: BigintIsh
  binStep: BigintIsh
  swapFee: BigintIsh
  protocolFee: BigintIsh
  lmPool?: Address
  tree?: BinTree
  reserveOfBin?: Record<ActiveId, Reserve>
}): BinPoolState => {
  invariant(Number.isInteger(swapFee) && BigInt(swapFee) <= TEN_PERCENT_FEE, 'SWAP_FEE')

  invariant(Number.isInteger(binStep) && BigInt(binStep) >= MIN_BIN_STEP && BigInt(binStep) <= MAX_BIN_STEP, 'BIN_STEP')

  invariant(Number.isInteger(activeId), 'ACTIVE_ID')

  const [currencyX, currencyY] = getSortedCurrencies(currencyA, currencyB)

  return {
    currencyX,
    currencyY,
    activeId: BigInt(activeId),
    binStep: BigInt(binStep),
    swapFee: BigInt(swapFee),
    protocolFee: BigInt(protocolFee),
    lmPool,
    reserveOfBin: reserveOfBin || {},
    tree,
  }
}
