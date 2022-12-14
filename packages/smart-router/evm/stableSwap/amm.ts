import { BigintIsh, JSBI, ZERO, ONE } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

interface Params {
  amplifier: BigintIsh
  balances: BigintIsh[]
}

/**
 * Calculate the constant D of Curve AMM formula
 * @see https://classic.curve.fi/files/stableswap-paper.pdf
 */
export function getD({ amplifier, balances }: Params): JSBI {
  const numOfCoins = balances.length
  invariant(numOfCoins > 1, 'To get constant D, pool should have at least two coins.')

  const sum = balances.reduce<JSBI>((s, cur) => JSBI.add(s, JSBI.BigInt(cur)), ZERO)
  if (JSBI.equal(sum, ZERO)) {
    return ZERO
  }

  const n = JSBI.BigInt(numOfCoins)
  // Equality with the precision of 1
  const precision = ONE
  // The amplifier is actually An^n-1, so we only times n here
  const ann = JSBI.multiply(JSBI.BigInt(amplifier), n)
  let dPrev = ZERO
  let d = sum
  for (let i = 0; i < 255; i += 1) {
    let dp = d
    for (const b of balances) {
      dp = JSBI.divide(JSBI.multiply(dp, d), JSBI.add(JSBI.multiply(JSBI.BigInt(b), n), JSBI.BigInt(1)))
    }
    dPrev = d
    d = JSBI.divide(
      JSBI.multiply(JSBI.add(JSBI.multiply(ann, sum), JSBI.multiply(dp, n)), d),
      JSBI.add(JSBI.multiply(JSBI.subtract(ann, ONE), d), JSBI.multiply(JSBI.add(n, ONE), dp)),
    )

    if (JSBI.greaterThan(d, dPrev) && JSBI.lessThanOrEqual(JSBI.subtract(d, dPrev), precision)) {
      break
    }

    if (JSBI.lessThanOrEqual(d, dPrev) && JSBI.lessThanOrEqual(JSBI.subtract(dPrev, d), precision)) {
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
export function getY({ amplifier, balances, i, j, x }: GetYParams): JSBI {
  const numOfCoins = balances.length
  invariant(numOfCoins > 1, 'To get y, pool should have at least two coins.')
  invariant(i !== j && i >= 0 && j >= 0 && i < numOfCoins && j < numOfCoins, `Invalid i: ${i} and j: ${j}`)

  const n = JSBI.BigInt(numOfCoins)
  const d = getD({ amplifier, balances })
  let sum = ZERO
  let c = d
  // The amplifier is actually An^n-1, so we only times n here
  const ann = JSBI.multiply(JSBI.BigInt(amplifier), n)
  for (const [index, b] of balances.entries()) {
    if (index === j) {
      // eslint-disable-next-line no-continue
      continue
    }
    let balanceAfterDeposit = JSBI.BigInt(b)
    if (index === i) {
      balanceAfterDeposit = JSBI.add(balanceAfterDeposit, JSBI.BigInt(x))
    }
    sum = JSBI.add(sum, balanceAfterDeposit)
    c = JSBI.divide(JSBI.multiply(c, d), JSBI.multiply(balanceAfterDeposit, n))
  }
  c = JSBI.divide(JSBI.multiply(c, d), JSBI.multiply(ann, n))
  const b = JSBI.add(sum, JSBI.divide(d, ann))

  // Equality with the precision of 1
  const precision = ONE
  let yPrev = ZERO
  let y = d
  for (let k = 0; k < 255; k += 1) {
    yPrev = y
    y = JSBI.divide(JSBI.add(JSBI.multiply(y, y), c), JSBI.subtract(JSBI.add(JSBI.multiply(JSBI.BigInt(2), y), b), d))

    if (JSBI.greaterThan(y, yPrev) && JSBI.lessThanOrEqual(JSBI.subtract(y, yPrev), precision)) {
      break
    }

    if (JSBI.lessThanOrEqual(y, yPrev) && JSBI.lessThanOrEqual(JSBI.subtract(yPrev, y), precision)) {
      break
    }
  }

  return y
}
