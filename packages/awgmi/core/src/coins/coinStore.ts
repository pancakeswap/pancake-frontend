import { MoveStructId } from '@aptos-labs/ts-sdk'

/* eslint-disable camelcase */
export const COIN_STORE_TYPE_PREFIX = '0x1::coin::CoinStore'
export const wrapCoinStoreTypeTag = (type: string): MoveStructId => `${COIN_STORE_TYPE_PREFIX}<${type}>`

export type CoinStoreResult = {
  coin: {
    value: string
  }
  deposit_events: {
    counter: string
    guid: {
      id: {
        addr: string
        creation_num: string
      }
    }
  }
  frozen: boolean
  withdraw_events: {
    counter: string
    guid: {
      id: {
        addr: string
        creation_num: string
      }
    }
  }
}
