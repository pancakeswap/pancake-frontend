export const COIN_STORE_TYPE_PREFIX = '0x1::coin::CoinStore'
export const wrapCoinStoreTypeTag = (type: string) => `${COIN_STORE_TYPE_PREFIX}<${type}>`
