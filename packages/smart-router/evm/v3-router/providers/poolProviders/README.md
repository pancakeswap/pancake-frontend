# Pool Providers

## Customized Pool Providers

**Why you might need your own customized pool providers?**

Off-chain data (like pool tvl in usd) is necessary for pool providers to pick the candidate pools to participate the routing algorithm. By default, smart router is relying on data from subgraph.

However, services like the graph may not be reliable and could suffer from unexpected downtime. Although the smart router package has multiple fallbacks by default, they may not suit your need.

Therefore, the smart router sdk is also designed in a way to open the possibilities for you to create your own pool providers with reliable data source.

### Customize V3 Pool Provider

1. Define v3 pool on-chain fetcher with customized tvl references

```typescript
import { SmartRouter } from '@pancakeswap/smart-router'

const { v3PoolsOnChainProviderFactory } = SmartRouter

// For the detailed params type definition pls refer to `GetV3PoolsParams`
const getV3PoolsWithCustomizedTvlReferences = v3PoolsOnChainProviderFactory((params) => {
  // Get pools tvl references based on input/output currencies
  // or currency pairs specified by the function caller
  const { currencyA, currencyB, pairs } = params

  // For the return type pls refer to `V3PoolTvlReference` exported by the smart router
  // NOTE: the return type should be a promise
  return getTvlReferencesFromOwnSource(currencyA, currencyB, pairs)
})
```

2. Build v3 candidate pool fetcher with customized fallbacks

In case your customized v3 pool fetcher suffers downtime, you can specify several fallback fetchers to guarantee the reliability of your service.

```typescript
import { SmartRouter } from '@pancakeswap/smart-router'

const { createGetV3CandidatePools, getV3PoolsWithTvlFromOnChainFallback } = SmartRouter

const getV3CandidatePools = createGetV3CandidatePools(
  // Use your customized v3 pool fetcher by default
  getV3PoolsWithCustomizedTvlReferences,
  {
    fallbacks: [getV3PoolsWithTvlFromOnChainFallback],

    // In millisecond
    // Will try fallback fetcher if the default doesn't respond in 2s
    fallbackTimeout: 2000,
  },
)

// For the detailed params type definition pls refer to `GetV3PoolsParams`
const v3Pools = await getV3CandidatePools(params)
```

### Customize V2 Pool Provider

For pool tvl references of v2 pools, smart router is using token reserves and token usd prices to roughly estimate the overall tvl of the pool. By default, token prices are fetched from subgraph.

Smart router allows you to customize to use your own source of token price to improve the reliability of the service.

1. Create token price provider with customized data source

```typescript
import { SmartRouter } from '@pancakeswap/smart-router'

const { createCommonTokenPriceProvider } = SmartRouter

const getCommonTokenPricesFromOwnSource = createCommonTokenPriceProvider(
  // The addresses are all checksum encoded
  // For the function type definition pls refer to `GetTokenPrices`
  ({ addresses, chainId }) => getTokenPricesFromOwnDataSource(addresses, chainId),
)
```

2. Create v2 pool on-chain fetcher with customized token price provider

```typescript
import { SmartRouter } from '@pancakeswap/smart-router'

const { createV2PoolsProviderByCommonTokenPrices } = SmartRouter

const getV2PoolsByCommonTokenPrices = createV2PoolsProviderByCommonTokenPrices(getCommonTokenPricesFromOwnSource)
```

3. Create v2 candidate pool fetcher with your own on-chain fetcher

```typescript
import { SmartRouter } from '@pancakeswap/smart-router'

const { createGetV2CandidatePools } = SmartRouter

const getV2CandidatePools = createGetV2CandidatePools(
  // Use your customized v3 pool fetcher by default
  getV2PoolsByCommonTokenPrices,
)

// For the detailed params type definition pls refer to `GetV2PoolsParams`
const v2Pools = await getV2CandidatePools(params)
```
