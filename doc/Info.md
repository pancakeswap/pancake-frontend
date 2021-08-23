# Documentation: Info

A brief overview how Info part of PancakeSwap website works.

## Code structure

In terms of React components Info section is just another view (located in [src/views/Info](../src/views/Info)) that is assigned route (in [App.tsx](../src/App.tsx)).  
There are also some Info-related components inside [src/components](../src/components) (InfoNav, InfoCharts, InfoTables and InfoSearch at the time of writing).

There are helper functions to handle data formatting and requests - [src/utils/infoDataHelpers.ts](../src/utils/infoDataHelpers.ts) and [src/utils/infoQueryHelpers.ts](../src/utils/infoQueryHelpers.ts)

Info section has it's own reducer in Redux store - [src/state/info](../src/state/info). It handles all data about pools, tokens and overall protocol. The only exception is token/pool watchlist that is stored under [src/state/user](../src/state/user) reducer.

GraphQL request logic lives under [src/state/info/queries](../src/state/info/queries) directory. Code over there handles firing requests to StreamingFast subgraph as well as formatting returned values and calculating all the derived data we need.

## Requests flow

When user visits Info page the following requests are fired (names as declared in [src/state/info/queries](../src/state/info/queries)):

`overview` - gets basic protocol data like volume, liquidity and transaction count. 3 requests are fired for current, 24h ago and 48h ago data.  
`overviewCharts` - gets data to show liquidity and volume charts on overview page.  
`overviewTransactions` - gets data to show transaction table on overview page

`prices` - gets BNB prices (current, 24h, 48 and 7d ago) used in calculations (see [src/hooks/useBnbPrices.ts](../src/hooks/useBnbPrices.ts))

`topTokens` - gets top NN pools by 24h volume. This request just fetches token addresses, full data is handled separately.
`tokens` - given the list of token addresses retrieves all needed data about these tokens. Done in single request but it is in fact 5 batched requests for different timeframes (needed to calculate rate of change). When user first opens the page this request is requesting data for token addresses acquired via `topTokens` request.

`topPools` - same as `topTokens` but for pools
`pools` - same as `tokens` but for pools

There are also multiple `blocks` queries to retrieve block numbers at different timestamps.

The flow is controlled by [src/state/info/updaters.ts](../src/state/info/updaters.ts). When user navigates through the site more pools and tokens are automatically loaded, (e.g. you click on BNB token and pools for BNB are loaded automatically, if you click on BNB-BTCB then BTCB token will be loaded, etc)

There are additional requests for price chart and search that are fired when user uses these features.
