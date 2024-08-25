import { ChainId } from '@pancakeswap/chains'
import {
  _10000,
  _9975,
  BigintIsh,
  CurrencyAmount,
  FIVE,
  InsufficientInputAmountError,
  InsufficientReservesError,
  MINIMUM_LIQUIDITY,
  ONE,
  Price,
  sqrt,
  ZERO,
} from '@pancakeswap/swap-sdk-core'
import { ERC20Token } from '@pancakeswap/swap-sdk-evm'
import invariant from 'tiny-invariant'
import {
  Address,
  ByteArray,
  concat,
  encodePacked,
  getAddress,
  GetCreate2AddressOptions,
  Hex,
  isBytes,
  keccak256,
  pad,
  slice,
  toBytes,
} from 'viem'

import { FACTORY_ADDRESS_MAP, INIT_CODE_HASH_MAP } from '../constants'

let PAIR_ADDRESS_CACHE: { [key: string]: Address } = {}

const composeKey = (token0: ERC20Token, token1: ERC20Token) => `${token0.chainId}-${token0.address}-${token1.address}`

function getCreate2Address(
  from_: GetCreate2AddressOptions['from'],
  salt_: GetCreate2AddressOptions['salt'],
  initCodeHash: Hex,
) {
  const from = toBytes(getAddress(from_))
  const salt = pad(isBytes(salt_) ? salt_ : toBytes(salt_ as Hex), {
    size: 32,
  }) as ByteArray

  return getAddress(slice(keccak256(concat([toBytes('0xff'), from, salt, toBytes(initCodeHash)])), 12))
}

const EMPTY_INPU_HASH = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const ZKSYNC_PREFIX = '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494' // keccak256('zksyncCreate2')

function getCreate2AddressZkSync(from: Address, salt: `0x${string}`, initCodeHash: `0x${string}`): `0x${string}` {
  return getAddress(
    `0x${keccak256(concat([ZKSYNC_PREFIX, pad(from, { size: 32 }), salt, initCodeHash, EMPTY_INPU_HASH])).slice(26)}`,
  )
}

export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
}: {
  factoryAddress: Address
  tokenA: ERC20Token
  tokenB: ERC20Token
}): Address => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const key = composeKey(token0, token1)

  if (PAIR_ADDRESS_CACHE?.[key] === undefined) {
    const getCreate2Address_ =
      token0.chainId === ChainId.ZKSYNC_TESTNET || token1.chainId === ChainId.ZKSYNC
        ? getCreate2AddressZkSync
        : getCreate2Address
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [key]: getCreate2Address_(
        factoryAddress,
        keccak256(encodePacked(['address', 'address'], [token0.address, token1.address])),
        INIT_CODE_HASH_MAP[token0.chainId as keyof typeof INIT_CODE_HASH_MAP],
      ),
    }
  }

  return PAIR_ADDRESS_CACHE[key]
}

export class Pair {
  public readonly liquidityToken: ERC20Token

  private readonly tokenAmounts: [CurrencyAmount<ERC20Token>, CurrencyAmount<ERC20Token>]

  public static getAddress(tokenA: ERC20Token, tokenB: ERC20Token): Address {
    return computePairAddress({
      factoryAddress: FACTORY_ADDRESS_MAP[tokenA.chainId as keyof typeof FACTORY_ADDRESS_MAP],
      tokenA,
      tokenB,
    })
  }

  public constructor(currencyAmountA: CurrencyAmount<ERC20Token>, tokenAmountB: CurrencyAmount<ERC20Token>) {
    const tokenAmounts = currencyAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [currencyAmountA, tokenAmountB]
      : [tokenAmountB, currencyAmountA]
    this.liquidityToken = new ERC20Token(
      tokenAmounts[0].currency.chainId,
      Pair.getAddress(tokenAmounts[0].currency, tokenAmounts[1].currency),
      18,
      'Cake-LP',
      'Pancake LPs',
    )
    this.tokenAmounts = tokenAmounts as [CurrencyAmount<ERC20Token>, CurrencyAmount<ERC20Token>]
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: ERC20Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1)
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price<ERC20Token, ERC20Token> {
    const result = this.tokenAmounts[1].divide(this.tokenAmounts[0])
    return new Price(this.token0, this.token1, result.denominator, result.numerator)
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price<ERC20Token, ERC20Token> {
    const result = this.tokenAmounts[0].divide(this.tokenAmounts[1])
    return new Price(this.token1, this.token0, result.denominator, result.numerator)
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: ERC20Token): Price<ERC20Token, ERC20Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.token0Price : this.token1Price
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): number {
    return this.token0.chainId
  }

  public get token0(): ERC20Token {
    return this.tokenAmounts[0].currency
  }

  public get token1(): ERC20Token {
    return this.tokenAmounts[1].currency
  }

  public get reserve0(): CurrencyAmount<ERC20Token> {
    return this.tokenAmounts[0]
  }

  public get reserve1(): CurrencyAmount<ERC20Token> {
    return this.tokenAmounts[1]
  }

  public reserveOf(token: ERC20Token): CurrencyAmount<ERC20Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    return token.equals(this.token0) ? this.reserve0 : this.reserve1
  }

  public getOutputAmount(inputAmount: CurrencyAmount<ERC20Token>): [CurrencyAmount<ERC20Token>, Pair] {
    invariant(this.involvesToken(inputAmount.currency), 'TOKEN')
    if (this.reserve0.quotient === ZERO || this.reserve1.quotient === ZERO) {
      throw new InsufficientReservesError()
    }
    const inputReserve = this.reserveOf(inputAmount.currency)
    const outputReserve = this.reserveOf(inputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const inputAmountWithFee = inputAmount.quotient * _9975
    const numerator = inputAmountWithFee * outputReserve.quotient
    const denominator = inputReserve.quotient * _10000 + inputAmountWithFee
    const outputAmount = CurrencyAmount.fromRawAmount(
      inputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator,
    )
    if (outputAmount.quotient === ZERO) {
      throw new InsufficientInputAmountError()
    }
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getInputAmount(outputAmount: CurrencyAmount<ERC20Token>): [CurrencyAmount<ERC20Token>, Pair] {
    invariant(this.involvesToken(outputAmount.currency), 'TOKEN')
    if (
      this.reserve0.quotient === ZERO ||
      this.reserve1.quotient === ZERO ||
      outputAmount.quotient >= this.reserveOf(outputAmount.currency).quotient
    ) {
      throw new InsufficientReservesError()
    }

    const outputReserve = this.reserveOf(outputAmount.currency)
    const inputReserve = this.reserveOf(outputAmount.currency.equals(this.token0) ? this.token1 : this.token0)
    const numerator = inputReserve.quotient * outputAmount.quotient * _10000
    const denominator = (outputReserve.quotient - outputAmount.quotient) * _9975
    const inputAmount = CurrencyAmount.fromRawAmount(
      outputAmount.currency.equals(this.token0) ? this.token1 : this.token0,
      numerator / denominator + ONE,
    )
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))]
  }

  public getLiquidityMinted(
    totalSupply: CurrencyAmount<ERC20Token>,
    tokenAmountA: CurrencyAmount<ERC20Token>,
    tokenAmountB: CurrencyAmount<ERC20Token>,
  ): CurrencyAmount<ERC20Token> {
    invariant(totalSupply.currency.equals(this.liquidityToken), 'LIQUIDITY')
    const tokenAmounts = tokenAmountA.currency.sortsBefore(tokenAmountB.currency) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA]
    invariant(tokenAmounts[0].currency.equals(this.token0) && tokenAmounts[1].currency.equals(this.token1), 'TOKEN')

    let liquidity: bigint
    if (totalSupply.quotient === ZERO) {
      liquidity = sqrt(tokenAmounts[0].quotient * tokenAmounts[1].quotient) - MINIMUM_LIQUIDITY
    } else {
      const amount0 = (tokenAmounts[0].quotient * totalSupply.quotient) / this.reserve0.quotient
      const amount1 = (tokenAmounts[1].quotient * totalSupply.quotient) / this.reserve1.quotient
      liquidity = amount0 <= amount1 ? amount0 : amount1
    }
    if (!(liquidity > ZERO)) {
      throw new InsufficientInputAmountError()
    }
    return CurrencyAmount.fromRawAmount(this.liquidityToken, liquidity)
  }

  public getLiquidityValue(
    token: ERC20Token,
    totalSupply: CurrencyAmount<ERC20Token>,
    liquidity: CurrencyAmount<ERC20Token>,
    feeOn = false,
    kLast?: BigintIsh,
  ): CurrencyAmount<ERC20Token> {
    invariant(this.involvesToken(token), 'TOKEN')
    invariant(totalSupply.currency.equals(this.liquidityToken), 'TOTAL_SUPPLY')
    invariant(liquidity.currency.equals(this.liquidityToken), 'LIQUIDITY')
    invariant(liquidity.quotient <= totalSupply.quotient, 'LIQUIDITY')

    let totalSupplyAdjusted: CurrencyAmount<ERC20Token>
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply
    } else {
      invariant(!!kLast, 'K_LAST')
      const kLastParsed = BigInt(kLast)
      if (!(kLastParsed === ZERO)) {
        const rootK = sqrt(this.reserve0.quotient * this.reserve1.quotient)
        const rootKLast = sqrt(kLastParsed)
        if (rootK > rootKLast) {
          const numerator = totalSupply.quotient * (rootK - rootKLast)
          const denominator = rootK * FIVE + rootKLast
          const feeLiquidity = numerator / denominator
          totalSupplyAdjusted = totalSupply.add(CurrencyAmount.fromRawAmount(this.liquidityToken, feeLiquidity))
        } else {
          totalSupplyAdjusted = totalSupply
        }
      } else {
        totalSupplyAdjusted = totalSupply
      }
    }

    if (totalSupply.equalTo(0)) {
      return CurrencyAmount.fromRawAmount(token, 0)
    }

    return CurrencyAmount.fromRawAmount(
      token,
      (liquidity.quotient * this.reserveOf(token).quotient) / totalSupplyAdjusted.quotient,
    )
  }
}
