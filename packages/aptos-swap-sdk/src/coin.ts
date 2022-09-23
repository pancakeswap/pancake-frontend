import { Token } from '@pancakeswap/swap-sdk-core'
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
    super(chainId, address, decimals, symbol, name, projectLink)
    // TODO: LP TOKEN
    // https://github.com/aptos-labs/aptos-core/blob/main/ecosystem/typescript/sdk/src/aptos_types/type_tag.ts#L147
    // const structTag = TxnBuilderTypes.StructTag.fromString(address)
    // this.structTag = structTag
  }
}
