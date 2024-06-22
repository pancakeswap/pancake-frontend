export const PRICE_API_WHITELISTED_CURRENCIES = ['ETH', 'USDT'] as const

export type PriceApiWhitelistedCurrency = (typeof PRICE_API_WHITELISTED_CURRENCIES)[number]
