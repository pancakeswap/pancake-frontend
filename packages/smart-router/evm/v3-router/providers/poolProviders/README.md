# Pool Providers

## V3 Pool Providers

### How to setup a customized v3 pool provider?

1. Define v3 pool on-chain fetcher with customized tvl references

Pool tvl references are necessary for us to pick the candidate pools to participate the route calculation.

Sometimes the service from the graph might be unstable so you may want to use your own source of pool tvl references.

```typescript
import { SmartRouter } from '@pancakeswap/smart-router/evm'

const { v3PoolsOnChainProviderFactory } = SmartRouter

// For the detailed params type definition pls refer to `GetV3CandidatePoolsParams`
const getV3PoolsWithCustomizedTvlReferences = v3PoolsOnChainProviderFactory((params) => {
  // Get pools tvl references based on input/output currencies
  // or currency pairs specified by the function caller
  const { currencyA, currencyB, pairs } = params

  // For the return type pls refer to `V3PoolTvlReference` exported by the smart router
  // NOTE: the return type should be a promise
  return getTvlReferencesFromOwnSource(currencyA, currencyB, pairs)
})
```

2. Build v3 pool fetcher with customized fallbacks

In case your customized v3 pool fetcher suffers downtime, you can specify several fallback fetchers to guarantee the reliability of your service.

```typescript
import { SmartRouter } from '@pancakeswap/smart-router/evm'

const { createGetV3CandidatePoolsWithFallbacks, getV3PoolsWithTvlFromOnChainFallback } = SmartRouter

const getV3CandidatePools = createGetV3CandidatePoolsWithFallbacks(
  // Use your customized v3 pool fetcher by default
  getV3PoolsWithCustomizedTvlReferences,
  {
    fallbacks: [getV3PoolsWithTvlFromOnChainFallback],

    // In millisecond
    // Will try fallback fetcher if the default doesn't respond in 2s
    fallbackTimeout: 2000,
  },
)

// For the detailed params type definition pls refer to `GetV3CandidatePoolsParams`
const v3Pools = await getV3CandidatePools(params)
```
