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
