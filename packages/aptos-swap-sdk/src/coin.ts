import { Token } from '@pancakeswap/swap-sdk-core'
import { HexString } from 'aptos'
import { Currency } from './currency'
// import { TxnBuilderTypes } from 'aptos'

export class Coin extends Token {
  // structTag: TxnBuilderTypes.StructTag

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol: string,
    name?: string,
    projectLink?: string
  ) {
    super(chainId, new HexString(address).toShortString(), decimals, symbol, name, projectLink)
    // TODO: LP TOKEN
    // https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/aptos_types/type_tag.ts#L147
    // const structTag = TxnBuilderTypes.StructTag.fromString(address)
    // this.structTag = structTag
  }

  public sortsBefore(other: Currency): boolean {
    return super.sortsBefore(other.wrapped)
  }

  public equals(other: Currency): boolean {
    return (
      this.chainId === other.chainId &&
      new HexString(this.address).toShortString() === new HexString(other.address).toShortString()
    )
  }
}
