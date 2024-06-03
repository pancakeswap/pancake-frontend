# PancakeSwap SDK (Deprecated)

Forked from the [Uniswap SDK](https://github.com/Uniswap/uniswap-v2-sdk/commit/a88048e9c4198a5bdaea00883ca00c8c8e582605).

You can refer to the Uniswap SDK documentation [uniswap.org](https://docs.uniswap.org/sdk/2.0.0/).

## Running tests

To run the tests, follow these steps. You must have at least node v10 and [pnpm](https://pnpm.io) installed.

First clone the repository:

```sh
git clone https://github.com/pancakeswap/pancake-swap-sdk.git
```

Move into the pancakeswap-sdk working directory

```sh
cd pancakeswap-sdk/
```

Install dependencies

```sh
pnpm install
```

Run tests

```sh
pnpm test
```

You should see output like the following:

```sh
pnpm run v1.22.4
$ tsdx test
 PASS  test/constants.test.ts
 PASS  test/pair.test.ts
 PASS  test/fraction.test.ts
 PASS  test/miscellaneous.test.ts
 PASS  test/entities.test.ts
 PASS  test/trade.test.ts

Test Suites: 1 skipped, 6 passed, 6 of 7 total
Tests:       3 skipped, 82 passed, 85 total
Snapshots:   0 total
Time:        5.091s
Ran all test suites.
✨  Done in 6.61s.
```
