import invariant from 'tiny-invariant'

export class Coin {
  /**
   * The chain ID on which this currency resides
   */
  public readonly chainId: number

  /**
   * The decimals used in representing currency amounts
   */
  public readonly decimals: number

  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol: string

  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name?: string

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string

  public readonly projectLink?: string

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.address = address
    this.projectLink = projectLink
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Coin): boolean {
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Coin): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Coin {
    return this
  }
}
