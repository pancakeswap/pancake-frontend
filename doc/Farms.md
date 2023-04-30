# Farms documentation

## How to add a new farm

- Add an entry in `packages/farms/constants/[chainId].ts`, below the farm with the pid 0
- Insert informations, with the LP address and the correct tokens (See [Tokens](./Tokens.md))
- Run `pnpm test:config` to make sure the data you set in the config match the data on chain

## Farms data

Farms data are used on several pages, so they are fetched when the app is mounted (`usePollCoreFarmData` in `App.tsx`).
Data are stored in the global redux state (`/state/farms`).
