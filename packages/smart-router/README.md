# Pancakeswap Smart Router

`@pancakeswap/smart-router` is a SDK for getting best trade routes from Pancakeswap AMM.

## Install

```bash
$ pnpm add @pancakeswap/smart-router

```

## Usage (V4Router)

V4Router is utilize the new routing strategy introduced in smart router v5. Use BSC as an example. Here's how we use v4 router to find the best trade route swapping from BNB to CAKE.

For working code example, please refer to [v4 router usage example](https://github.com/pancakeswap/smart-router-example).

0. Install other dependencies

```bash
$ pnpm add @pancakeswap/smart-router@5 viem@1 @pancakeswap/sdk@5 @pancakeswap/tokens
```

1. Prepare on-chain rpc provider

```typescript
import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://bsc-dataseed1.binance.org'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})
```

2. Get candidate pools

```typescript
import { Native } from '@pancakeswap/sdk'
import { V4Router } from '@pancakeswap/smart-router'
import { bscTokens } from '@pancakeswap/tokens'

const swapFrom = Native.onChain(chainId)
const swapTo = bscTokens.cake

const v3Pools = await V4Router.getV3CandidatePools({
  clientProvider: () => client,
  currencyA: swapFrom,
  currencyB: swapTo,
})
```

3. Find the best swap trade route

```typescript
import { CurrencyAmount, TradeType } from '@pancakeswap/sdk'

// 0.01 BNB in our example
const amount = CurrencyAmount.fromRawAmount(swapFrom, 10 ** 16)

const trade = await V4Router.getBestTrade(amount, swapTo, TradeType.EXACT_INPUT, {
  gasPriceWei: () => client.getGasPrice(),
  candidatePools: v3Pools,
})
```

## Usage (SmartRouter)

Use BSC as an example. Here's how we use smart router sdk to find the best trade route swapping from BNB to CAKE and construct a valid swap transaction from the trade route we got.

For working code example, please refer to [smart-router-example](https://github.com/pancakeswap/smart-router-example).

0. Install other dependencies

```bash
$ pnpm add viem@1 graphql-request@5.0.0 @pancakeswap/sdk @pancakeswap/tokens
```

1. Prepare on-chain rpc provider and subgraph providers

```typescript
import { createPublicClient, http } from 'viem'
import { GraphQLClient } from 'graphql-request'
import { SmartRouter } from '@pancakeswap/smart-router'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://bsc-dataseed1.binance.org'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const v3SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc')
const v2SubgraphClient = new GraphQLClient('https://proxy-worker-api.pancakeswap.com/bsc-exchange')

const quoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: () => publicClient })
```

2. Get candidate pools

```typescript
import { Native } from '@pancakeswap/sdk'
import { SmartRouter } from '@pancakeswap/smart-router'
import { bscTokens } from '@pancakeswap/tokens'

const swapFrom = Native.onChain(chainId)
const swapTo = bscTokens.cake

const [v2Pools, v3Pools] = await Promise.all([
  SmartRouter.getV2CandidatePools({
    onChainProvider: () => publicClient,
    v2SubgraphProvider: () => v2SubgraphClient,
    v3SubgraphProvider: () => v3SubgraphClient,
    currencyA: swapFrom,
    currencyB: swapTo,
  }),
  SmartRouter.getV3CandidatePools({
    onChainProvider: () => publicClient,
    subgraphProvider: () => v3SubgraphClient,
    currencyA: swapFrom,
    currencyB: swapTo,
  }),
])
```

3. Find the best swap trade route

```typescript
import { CurrencyAmount, TradeType } from '@pancakeswap/sdk'

// 0.01 BNB in our example
const amount = CurrencyAmount.fromRawAmount(swapFrom, 10 ** 16)

const trade = await SmartRouter.getBestTrade(amount, swapTo, TradeType.EXACT_INPUT, {
  gasPriceWei: () => publicClient.getGasPrice(),
  maxHops: 2,
  maxSplits: 2,
  poolProvider: SmartRouter.createStaticPoolProvider(pools),
  quoteProvider,
  quoterOptimization: true,
})
```

4. Build the swap transaction from trade

```typescript
import { ChainId } from '@pancakeswap/chains'
import { SmartRouter, SMART_ROUTER_ADDRESSES, SwapRouter } from '@pancakeswap/smart-router'
import { hexToBigInt } from 'viem'

const routerAddress = SMART_ROUTER_ADDRESSES[ChainId.BSC]
// Swap recipient address
const address = '0x'

const { value, calldata } = SwapRouter.swapCallParameters(trade, {
  recipient: address,
  slippageTolerance: new Percent(1),
})

const tx = {
  account: address,
  to: routerAddress,
  data: calldata,
  value: hexToBigInt(value),
}
const gasEstimate = await publicClient.estimateGas(tx)
```

## FAQ

1. What's the difference between `SmartRouter` and `V4Router`?

`SmartRouter` is getting swap quotes by querying quoter contract on chain, while `V4Router` is getting the liquidity pool data from on chain and do the swap quote calculation off chain.

Compared to `SmartRouter`, `V4Router` has better quoting performance since the calculation is done off chain. Also, `V4Router` doesn't rely on subgraph for price reference. However, the downside of `V4Router` is that the estimated quote may not be as accurate as on chain quoter due to pool data out dated or potential extra fee applied during the swap.
