import { MoveStructId } from '@aptos-labs/ts-sdk'

export const wrapCoinInfoTypeTag = (type: string): MoveStructId => `0x1::coin::CoinInfo<${type}>`
