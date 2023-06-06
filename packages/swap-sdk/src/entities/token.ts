import { BaseCurrency, Currency, Token } from '@pancakeswap/swap-sdk-core'
import { Address } from 'viem'
import invariant from 'tiny-invariant'
import { validateAndParseAddress } from '../utils'

export interface SerializedToken {
  chainId: number
  address: Address
  decimals: number
  symbol: string
  name?: string
  projectLink?: string
}

// /**
//  * Represents an ERC20 token with a unique address and some metadata.
//  */
export class ERC20Token extends Token {
  public constructor(
    chainId: number,
    address: Address,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    super(chainId, validateAndParseAddress(address), decimals, symbol, name, projectLink)
  }
}

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class OnRampCurrency extends BaseCurrency {
  public readonly isNative: boolean

  public readonly isToken: boolean

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: `0x${string}`

  public readonly projectLink?: string

  public constructor(
    chainId: number,
    address: `0x${string}`,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    super(chainId, decimals, symbol, name)
    this.address = address
    this.projectLink = projectLink
    this.isNative = address === '0x' && true
    this.isToken = address !== '0x' && true
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return other.isToken && this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Currency): boolean {
    if (!other.isToken) return false
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this as Token
  }

  public get serialize(): SerializedToken {
    return {
      address: this.address,
      chainId: this.chainId,
      decimals: this.decimals,
      symbol: this.symbol,
      name: this.name,
      projectLink: this.projectLink,
    }
  }
}
