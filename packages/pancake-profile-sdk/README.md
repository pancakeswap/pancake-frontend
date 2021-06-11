# Pancakeswap Profile SDK

This package provides some handy functions to retrieve data for Pancakeswap Profile system.

If you're looking for React-ready solution - take a look at the [profile-hook](https://github.com/pancakeswap/pancake-toolkit/tree/master/packages/pancake-profile-hook).

##### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [getUsername](#getUsername)
  - [getTeam](#getTeam)
  - [getProfile](#getProfile)
  - [getAchievements](#getAchievements)
- [Roadmap](#roadmap)

## Installation

Install `@pancakeswap/profile-sdk` into your project with npm:

```bash
npm install @pancakeswap/profile-sdk --save
```

or yarn:

```bash
yarn add @pancakeswap/profile-sdk
```

This package requires `web3` to be installed in your project. If you're using TypeScript you also should install `web3-eth-contract` and `web3-utils` to avoid type errors, although depending on your TypeScript and ESlint configuration you might skip installing those (since they are sub-packages of web3).

```bash
# npm
npm install web3 --save
# yarn
yarn add web3
```

## Usage

### Initialization

First set is to initialize the SDK with the following:

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();
```

You can pass optional arguments to the constructor:

- `web3` - custom web3 instance if you want to use web3 instance with custom configuration, if not provided defaults to the following configuration:
  - HTTP provider with timeout of 10 seconds
  - a random node is chosen on initialization from the [list of RPC nodes](src/utils/getRpcUrl.ts)
  - the rest of the configuration is default Web3
- `chainId` - what chain ID to use, if not provided defaults to `56`

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";
import Web3 from "web3";

const httpProvider = new Web3.providers.HttpProvider("https://mycustomnode.com", {
  timeout: 5000,
});
const myWeb3 = new Web3(httpProvider);

const pancakeSdk = new PancakeProfileSdk(myWeb3, 97);
```

### getUsername

Returns username for a given address. If the address does not have a profile or there is an error - returns empty string `""`.

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();
const username = pancakeSdk.getUsername("0x123456789");
console.log(username); // "Matatabi"
```

### getTeam

Returns team information for the team ID. In case of network error returns null. Note that at the moment `points` will return `0` for all teams (total team points will be calculated soon).

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();
const team = pancakeSdk.getTeam(1);
console.log(team);
// {
//   id: 1,
//   name: "Syrup Storm",
//   description: "The storm's a-comin! Watch out! These bulls are stampeding in a syrupy surge!",
//   isJoinable: true,
//   users: 55123;
//   points: 182500;
//   images: images: {
//     lg: "syrup-storm-lg.png",
//     md: "syrup-storm-md.png",
//     sm: "syrup-storm-sm.png",
//     alt: "syrup-storm-alt.png",
//     ipfs: "https://gateway.pinata.cloud/ipfs/QmXKzSojwzYjtDCVgR6mVx7w7DbyYpS7zip4ovJB9fQdMG/syrup-storm.png",
//   },
//   background: syrup-storm-bg.svg;
//   textColor: "#191326";
// }
```

### getProfile

Returns full profile data for a given address. Under the hood retrieves username and team data using `getUsername` and `getTeam` and combines it with data from the profile contract. If address does not have a profile - returns `{ hasRegistered: false, profile: null }`. At the moment does not retrieve achievements (see [getAchievements](#getAchievements)).

It also sets `profile_${address}` cookie containing username and avatar (now only for pancakeswap.finance domain, maybe configurable in future versions)

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();
const profile = pancakeSdk.getProfile("0x123456789");
console.log(profile);
// {
//   hasRegistered: true
//   profile: {
//     userId: 6173,
//     points: 2500,
//     teamId: 1,
//     nftAddress: "0x11111111",
//     tokenId: 15,
//     isActive: true,
//     username: "Matatabi",
//     nft: {
//       name: "Hiccup",
//       description: "Oopsie daisy! Hiccup's had a bit of an accident. Poor little fella.",
//       images: {
//         lg: "hiccup-lg.png",
//         md: "hiccup-md.png",
//         sm: "hiccup-sm.png",
//         ipfs: "https://gateway.pinata.cloud/ipfs/QmQ6EE6gkVzAQUdQLLM7CyrnME6LZHCoy92ZERW8HXmyjw/hiccup.png",
//       },
//       sortOrder: 999,
//       identifier: 'hiccup'
//       type: 'pancake',
//       variationId: 10
//     },
//     team: {
//       id: 1,
//       name: "Syrup Storm",
//       description: "The storm's a-comin! Watch out! These bulls are stampeding in a syrupy surge!",
//       isJoinable: true,
//       users: 55123,
//       points: 182500,
//       images: images: {
//         lg: "syrup-storm-lg.png",
//         md: "syrup-storm-md.png",
//         sm: "syrup-storm-sm.png",
//         alt: "syrup-storm-alt.png",
//         ipfs: "https://gateway.pinata.cloud/ipfs/QmXKzSojwzYjtDCVgR6mVx7w7DbyYpS7zip4ovJB9fQdMG sy  rup-storm.png",
//       },
//       background: syrup-storm-bg.svg,
//       textColor: "#191326"
//     },
//     hasRegistered: true
//   }
// }
```

### getAchievements

Returns array of achievements for a given address. If address has no achievements or no profile at all - returns empty array `[]`.

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();

const achievements = pancakeSdk.getAchievements("0x123456789");
console.log(achievements);
// [
//   {
//     id: "511080000",
//     type: "ifo",
//     address: "0x123456789",
//     title: {
//       id: 999,
//       fallback: `IFO Shopper: Belt`,
//       data: {
//         name: "Belt",
//       },
//     },
//     description: {
//       id: 999,
//       fallback: `Committed more than $5 worth of LP in the Belt IFO`,
//       data: {
//         name: "Belt",
//       },
//     },
//     badge: "ifo-belt.svg",
//     points: 200,
//   },
//   {
//     id: "512010010",
//     type: "teambattle",
//     address: "0x123456789",
//     title: "Easter Participant: Silver",
//     badge: "easter-participant-silver.svg",
//     points: 500,
//   },
// ];
```

## Roadmap

Current version of this SDK is 90% copy of existing from [pancake-frontend](https://github.com/pancakeswap/pancake-frontend) repo. There are several improvements to be made in the future versions of this SDK:

- [ ] Better error handling (common bad status codes or broken internet connection)
- [ ] Allow username & avatar cookie to be configurable or optional
- [ ] Validate addresses with regex and don't attempt to fetch data if address is not valid
- [ ] NodeJS support. Currently it works out of the box only in browser. Need to research different options for cross-fetch and choose the one that provides less friction and increases bundle size the least.
