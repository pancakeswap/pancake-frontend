# PancakeSwap V4 SDK

PancakeSwap V4 Official SDK, used for PancakeSwap Interface and interacting with [PancakeSwap V4 smart contracts](https://github.com/pancakeswap/pancake-v4-core).

## Usage

### CLAMM Pool

TBD

### Bin Pool

in Bin Pool, we use symbol `Y` and `X` to represent the two tokens in the pool. Like the `1` and `0` in CLAMM Pool.


- [getBinPool](./src/functions/bin/getBinPool.ts): Get the bin pool with state
- [getIdFromPrice](./src/functions/bin/getIdFromPrice.ts): Get the bin id from given price
- [getPriceFromId](./src/functions/bin/getPriceFromId.ts): Get the price from given bin id
- [getNextNonEmptyBin](./src/functions/bin/getNextNonEmptyBin.ts): Get the next non-empty bin
- [swap](./src/functions/bin/swap.ts): Dry run Swap tokens in bin pool, return the state after swap

### Utils for both CLAMM and Bin Pool

- [getPoolId](./src/utils/getPoolId.ts): Get the pool id from given PoolKey
- [getSortedCurrencies](./src/utils/getSortedCurrencies.ts): Returns the sorted currencies from given
- [encodeHooksRegistration](./src/utils/encodeHooksRegistration.ts): hooks registration option encoder
- [encodePoolParameters](./src/utils/encodePoolParameters.ts): pool parameters encoder

## Contributing

```sh
pnpm install
pnpm run test
```