# Pools documentation

## How to add a new pool

- Add an entry in `/config/constants/pools.ts`, below the pool with the id 0
- Insert informations, with the contract address and the correct tokens (See [Tokens](./Tokens.md))
- Run `yarn test:config` to make sure the data you set in the config match the data on chain

Pools APRs depend on farm data to compute prices

## Pools data

Data are stored in the global redux state (`/state/pools`).
