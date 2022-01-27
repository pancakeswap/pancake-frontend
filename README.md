# Pancake Toolkit

This repository is a monorepo manage with [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) and [Nx](https://nx.dev/).

## Packages

- [pancake-uikit](https://github.com/pancakeswap/pancake-frontend/tree/master/packages/pancake-uikit) : React components used to build the Pancake UI
- [eslint-config-pancake](https://github.com/pancakeswap/pancake-frontend/tree/master/packages/eslint-config-pancake) : An ESLint config for pancake, with Typescript and Prettier support
- [pancake-profile-sdk](https://github.com/pancakeswap/pancake-frontend/tree/master/packages/pancake-profile-sdk) : Handy functions to retrieve data for Pancakeswap Profile system
- [token-lists](https://github.com/pancakeswap/pancake-frontend/tree/master/packages/token-lists) : Main PancakeSwap token list and tools to validate it

## How to use

Clone the repository

```
git clone git@github.com:pancakeswap/pancake-frontend.git
```

Run yarn at the root of the workspace

```
cd pancake-frontend
yarn
```

Run the web by `yarn dev`

Build the web by `yarn build:local`

For packages, please refer to the readme of each project.
