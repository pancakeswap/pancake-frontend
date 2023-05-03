import { BigintIsh, ZERO, ONE } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

interface Params {
  amplifier: BigintIsh
  balances: BigintIsh[]
}

/**
 * Calculate the constant D of Curve AMM formula
 * @see https://classic.curve.fi/files/stableswap-paper.pdf
 */
export function getD({ amplifier, balances }: Params): bigint {
  const numOfCoins = balances.length
  invariant(numOfCoins > 1, 'To get constant D, pool should have at least two coins.')

  const sum = balances.reduce<bigint>((s, cur) => s + BigInt(cur), ZERO)
  if (sum === ZERO) {
    return ZERO
  }

  const n = BigInt(numOfCoins)
  // Equality with the precision of 1
  const precision = ONE
  // The amplifier is actually An^n-1, so we only times n here
  const ann = BigInt(amplifier) * n
  let dPrev = ZERO
  let d = sum
  for (let i = 0; i < 255; i += 1) {
    let dp = d
    for (const b of balances) {
      dp = (dp * d) / (BigInt(b) * n + 1n)
    }
    dPrev = d
    d = ((ann * sum + dp * n) * d) / ((ann - ONE) * d + (n + ONE) * dp)

    if (d > dPrev && d - dPrev <= precision) {
      break
    }

    if (d <= dPrev && dPrev - d <= precision) {
      break
    }
  }

  return d
}

interface GetYParams {
  amplifier: BigintIsh
  balances: BigintIsh[]
  // The index of the base token
  i: number
  // The index of the swap target token
  j: number
  // The amount of token i that user deposit
  x: BigintIsh
}

/**
 * Calculate the expected token amount y after user deposit
 * @see https://classic.curve.fi/files/stableswap-paper.pdf
 */
export function getY({ amplifier, balances, i, j, x }: GetYParams): bigint {
  const numOfCoins = balances.length
  invariant(numOfCoins > 1, 'To get y, pool should have at least two coins.')
  invariant(i !== j && i >= 0 && j >= 0 && i < numOfCoins && j < numOfCoins, `Invalid i: ${i} and j: ${j}`)

  const n = BigInt(numOfCoins)
  const d = getD({ amplifier, balances })
  let sum = ZERO
  let c = d
  // The amplifier is actually An^n-1, so we only times n here
  const ann = BigInt(amplifier) * n
  for (const [index, b] of balances.entries()) {
    if (index === j) {
      // eslint-disable-next-line no-continue
      continue
    }
    let balanceAfterDeposit = BigInt(b)
    if (index === i) {
      balanceAfterDeposit += BigInt(x)
    }

    invariant(balanceAfterDeposit > ZERO, 'Insufficient liquidity')

    sum += balanceAfterDeposit
    c = (c * d) / (balanceAfterDeposit * n)
  }
  c = (c * d) / (ann * n)
  const b = sum + d / ann

  // Equality with the precision of 1
  const precision = ONE
  let yPrev = ZERO
  let y = d
  for (let k = 0; k < 255; k += 1) {
    yPrev = y
    y = (y * y + c) / (2n * y + b - d)

    if (y > yPrev && y - yPrev <= precision) {
      break
    }

    if (y <= yPrev && yPrev - y <= precision) {
      break
    }
  }

  return y
}
