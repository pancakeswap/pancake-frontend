import pancakeBunnies from 'config/constants/nfts/pancakeBunnies'
import { CollectibleAndOwnerData, NFTLocation, UserCollectibles, Collectible } from './types'

export const twinkleForSale: Collectible = {
  name: 'Pancake Bunnies',
  cost: 0.02,
  lowestCost: 0.002,
  nft: pancakeBunnies[15],
  status: 'selling',
}

export const twinkleWallet: Collectible = {
  name: 'Pancake Bunnies',
  cost: 0.02,
  lowestCost: 0.002,
  nft: pancakeBunnies[15],
  status: 'wallet',
}

export const twinkleProfilePic: Collectible = {
  name: 'Pancake Bunnies',
  cost: 0.02,
  lowestCost: 0.002,
  nft: pancakeBunnies[15],
  status: 'profile',
}

export const userCollectibles: UserCollectibles = {
  [NFTLocation.FOR_SALE]: [twinkleForSale, twinkleForSale, twinkleForSale],
  [NFTLocation.IN_WALLET]: [twinkleWallet, twinkleWallet, twinkleWallet],
  [NFTLocation.PROFILE_PIC]: [twinkleProfilePic],
}

export const collectiblesForSale: CollectibleAndOwnerData[] = [
  {
    owner: {
      account: '0xb6e510ae2da1ab4e350f837c70823ab75091780e',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xbedb490970204cb3cc7b0fea94463bed67d5364d',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xb2b62f88ab82ed0bb4ab4da60d9dc9acf9e816e5',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xde4aef42bb27a2cb45c746acde4e4d8ab711d27c',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0x3b804460c3c62f0f565af593984159f13b1ac976',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xa39af17ce4a8eb807e076805da1e2b8ea7d0755b',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xd1812e7e28c39e78727592de030fc0e7c366d61a',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0x804678fa97d91b974ec2af3c843270886528a9e6',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xb56299d8fbf46c509014b103a164ad1fc65ea222',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0xb56299d8fbf46c509014b103a164ad1fc65ea222',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
  {
    owner: {
      account: '0x4cf8800ccc0a56396f77b1e7c46160f5df0e09a5',
      profileName: 'MissPiggy',
    },
    collectible: twinkleForSale,
  },
]
