# Pancakeswap Profile SDK

This package provides some handy functions to retrieve data for Pancakeswap Profile system.

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

This package requires `ethers`, `graphql` and `graphql-request` to be installed in your project.

```bash
# npm
npm install ethers graphql graphql-request --save
# yarn
yarn add ethers graphql graphql-request
```

## Usage

### Initialization

First set is to initialize the SDK with the following:

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";

const pancakeSdk = new PancakeProfileSdk();
```

You can pass optional arguments to the constructor:

- `provider` - custom RPC Provider instance if you want to use custom configuration, if not provided defaults to provider with random node from the [list of RPC nodes](src/utils/getRpcUrl.ts)
- `chainId` - what chain ID to use, if not provided defaults to `56`

```js
import PancakeProfileSdk from "@pancakeswap/profile-sdk";
import { ethers } from "ethers";

const customProvider = new ethers.providers.JsonRpcProvider("https://example.com");

const pancakeSdk = new PancakeProfileSdk(customProvider, 97);
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

### Using images

This package bundles some images within itself, it exports `achievementBadges` and `teamImages` which are javascript objects with keys matching the image names returned by the API (e.g. `"syrup-storm-md.png"`) and values are Base64 encoded images:

```JSX
import { Team, teamImages } from "@pancakeswap/profile-sdk";

const team = pancakeSdk.getTeam(1);
// ...
return <img src={teamImages[team.images.md]} alt={team.name} width="96px" height="96px" />
```

Also `bunnyPlaceholder` image is exported to provide fallback for e.g. unregistered users.

## Roadmap

Current version of this SDK is 90% copy of existing from [pancake-frontend](https://github.com/pancakeswap/pancake-frontend) repo. There are several improvements to be made in the future versions of this SDK:

- [ ] Better error handling (common bad status codes or broken internet connection)
- [ ] Allow username & avatar cookie to be configurable or optional
- [ ] Validate addresses and don't attempt to fetch data if address is not valid
- [ ] NodeJS support. Currently it works out of the box only in browser. Need to research different options for cross-fetch and choose the one that provides less friction and increases bundle size the least.
