// TODO: aptos split Token to sdk-core
import { Token } from '@pancakeswap/sdk'
import { TxnBuilderTypes } from 'aptos'

export class Coin extends Token {
  structTag: TxnBuilderTypes.StructTag

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    const structTag = TxnBuilderTypes.StructTag.fromString(address)
    super(chainId, address, decimals, symbol, name, projectLink)
    this.structTag = structTag
  }
}
