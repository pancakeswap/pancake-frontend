import JSBI from 'jsbi'
import invariant from 'tiny-invariant'
import {
  Price,
  BigintIsh,
  FIVE,
  ONE,
  ZERO,
  _10000,
  _9975,
  InsufficientInputAmountError,
  InsufficientReservesError,
  CurrencyAmount,
  sqrt,
  MINIMUM_LIQUIDITY,
} from '@pancakeswap/swap-sdk-core'
import { TypeTagParser, TxnBuilderTypes, HexString } from 'aptos'

import { Currency } from './currency'
import { PAIR_LP_TYPE_TAG, PAIR_RESERVE_TYPE_TAG } from './constants'
import { Coin } from './coin'

export class Pair {
  public readonly liquidityToken: Coin

  private readonly tokenAmounts: [CurrencyAmount<Currency>, CurrencyAmount<Currency>]

  public static sortToken(tokenA: Currency, tokenB: Currency): [Currency, Currency] {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // it does safety checks
    return [token0, token1]
  }

  public static getAddress(tokenA: Currency, tokenB: Currency): string {
    const [token0, token1] = this.sortToken(tokenA, tokenB)

    return `${PAIR_LP_TYPE_TAG}<${token0.address}, ${token1.address}>`
  }

  public static getReservesAddress(tokenA: Currency, tokenB: Currency): string {
    const [token0, token1] = this.sortToken(tokenA, tokenB)

    return `${PAIR_RESERVE_TYPE_TAG}<${token0.address}, ${token1.address}>`
  }

  public static parseType(type: string) {
    const parsedTypeTag = new TypeTagParser(type).parseTypeTag()
    invariant(parsedTypeTag instanceof TxnBuilderTypes.TypeTagStruct, `Pair type: ${type}`)
    invariant(parsedTypeTag.value.type_args.length === 2, `Pair type length`)

    const [typeArg0, tyepArg1] = parsedTypeTag.value.type_args

    invariant(
      typeArg0 instanceof TxnBuilderTypes.TypeTagStruct && tyepArg1 instanceof TxnBuilderTypes.TypeTagStruct,
      'type args'
    )

    const [address0, address1] = [
      `${HexString.fromUint8Array(typeArg0.value.address.address).toShortString()}::${
        typeArg0.value.module_name.value
      }::${typeArg0.value.name.value}`,
      `${HexString.fromUint8Array(tyepArg1.value.address.address).toShortString()}::${
        tyepArg1.value.module_name.value
      }::${tyepArg1.value.name.value}`,
    ]

    return [address0, address1] as const
  }

  static getLiquidityToken(tokenA: Currency, tokenB: Currency) {
    const [token0, token1] = this.sortToken(tokenA, tokenB)
    return new Coin(
      tokenA.chainId,
      Pair.getAddress(tokenA, tokenB),
      8,
      'Cake-LP',
      `Pancake-${token0.symbol}-${token1.symbol}-LP`
    )
  }

  public constructor(currencyAmountA: CurrencyAmount<Currency>, tokenAmountB: CurrencyAmount<Currency>) {
    const tokenAmounts = currencyAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [currencyAmountA, tokenAmountB]
      : [tokenAmountB, currencyAmountA]
    this.liquidityToken = Pair.getLiquidityToken(tokenAmounts[0].currency, tokenAmounts[1].currency)
    this.tokenAmounts = tokenAmounts as [CurrencyAmount<Currency>, CurrencyAmount<Currency>]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Currency): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<Currency, Currency> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<Currency, Currency> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Currency): Price<Currency, Currency> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): Currency {
    return this.tokenAmounts[0].currency
  }

  public get token1(): Currency {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): CurrencyAmount<Currency> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): CurrencyAmount<Currency> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: Currency): CurrencyAmount<Currency> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: CurrencyAmount<Currency>): [CurrencyAmount<Currency>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (JSBI.equal(this.reserve0.quotient, ZERO) || JSBI.equal(this.reserve1.quotient, ZERO)) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = JSBI.multiply(inputAmount.quotient, _9975)
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.quotient)
    const denominator = JSBI.add(JSBI.multiply(inputReserve.quotient, _10000), inputAmountWithFee)
    const outputAmount = CurrencyAmount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator)
    )
    if (JSBI.equal(outputAmount.quotient, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: CurrencyAmount<Currency>): [CurrencyAmount<Currency>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      JSBI.equal(this.reserve0.quotient, ZERO) ||
      JSBI.equal(this.reserve1.quotient, ZERO) ||
      JSBI.greaterThanOrEqual(outputAmount.quotient, this.reserveOf(outputAmount.currency).quotient)
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = JSBI.multiply(JSBI.multiply(inputReserve.quotient, outputAmount.quotient), _10000)
    const denominator = JSBI.multiply(JSBI.subtract(outputReserve.quotient, outputAmount.quotient), _9975)
    const inputAmount = CurrencyAmount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE)
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: CurrencyAmount<Currency>,
    tokenAmountA: CurrencyAmount<Currency>,
    tokenAmountB: CurrencyAmount<Currency>
  ): CurrencyAmount<Currency> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: JSBI
    if (JSBI.equal(totalSupply.quotient, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(tokenAmounts[0].quotient, tokenAmounts[1].quotient)),
        MINIMUM_LIQUIDITY
      )
    } else {
      const amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].quotient, totalSupply.quotient), this.reserve0.quotient)
      const amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].quotient, totalSupply.quotient), this.reserve1.quotient)
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: Currency,
    totalSupply: CurrencyAmount<Currency>,
    liquidity: CurrencyAmount<Currency>,
    feeOn = false,
    kLast?: BigintIsh
  ): CurrencyAmount<Currency> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(JSBI.lessThanOrEqual(liquidity.quotient, totalSupply.quotient), 'LIQUIDITY')

    let totalSupplyAdjusted: CurrencyAmount<Currency>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = JSBI.BigInt(kLast)
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.quotient, this.reserve1.quotient))
        const rootKLast = sqrt(kLastParsed)
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(totalSupply.quotient, JSBI.subtract(rootK, rootKLast))
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast)
          const feeLiquidity = JSBI.divide(numerator, denominator)
          totalSupplyAdjusted = totalSupply.add(CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    return CurrencyAmount.fromRawAmount(
      token,
      JSBI.divide(JSBI.multiply(liquidity.quotient, this.reserveOf(token).quotient), totalSupplyAdjusted.quotient)
    )
  }
}
