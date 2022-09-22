import { Token } from '@pancakeswap/swap-sdk-core'

export class Coin extends Token {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    super(chainId, address, decimals, symbol, name, projectLink)
    // TODO: LP TOKEN
    // const structTag = TxnBuilderTypes.StructTag.fromString(address)
    // this.structTag = structTag
  }
}
