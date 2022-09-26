import { NativeCurrency, SerializedToken } from '@pancakeswap/swap-sdk-core'
import { TxnBuilderTypes } from 'aptos'
import { Coin } from './coin'
import { Currency } from './currency'

const APTOS_COIN = '0x1::aptos_coin::AptosCoin' as const

export class AptosCoin extends NativeCurrency {
  address: typeof APTOS_COIN = APTOS_COIN

  structTag: TxnBuilderTypes.StructTag = TxnBuilderTypes.StructTag.fromString(APTOS_COIN)

  projectLink = 'https://aptoslabs.com/'

  protected constructor(chainId: number) {
    super(chainId, 8, 'APT', 'Aptos Coin')
  }

  private static _aptosCache: { [chainId: number]: AptosCoin } = {}

  public static onChain(chainId: number): AptosCoin {
    // eslint-disable-next-line no-return-assign
    return this._aptosCache[chainId] ?? (this._aptosCache[chainId] = new AptosCoin(chainId))
  }

  public equals(other: Currency): boolean {
    if (other.chainId === this.chainId) {
      if (other.isNative || other.address === this.address) {
        return true
      }
      return false
    }
    return false
  }

  get wrapped(): Coin {
    return new Coin(this.chainId, this.address, this.decimals, this.symbol, this.name, this.projectLink)
  }

  // eslint-disable-next-line class-methods-use-this
  public sortsBefore(_other: Currency): boolean {
    return true
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
