export const getBaseNftFields = () => `
  tokenId
  metadataUrl
  currentAskPrice
  currentSeller
  latestTradedPriceInBNB
  tradeVolumeBNB
  totalTrades
  isTradable
  updatedAt
  collection {
    id
  }
`

export const getBaseTransactionFields = () => `
  id
  block
  timestamp
  askPrice
  netPrice
  withBNB
  buyer {
    id
  }
  seller {
    id
  }
`

export const getCollectionBaseFields = () => `
  id
  name
  symbol
  active
  totalTrades
  totalVolumeBNB
  numberTokensListed
  creatorAddress
  tradingFee
  creatorFee
  whitelistChecker
`
