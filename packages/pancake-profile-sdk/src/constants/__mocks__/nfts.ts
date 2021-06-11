import { Nft, NftSource, NftType } from "../../types";
import { IPFS_GATEWAY } from "../common";

// This mock file is needed to properly test different NFT types
// and also not rely in tests on any value changes in the future

export const nftSources: NftSource = {
  [NftType.PANCAKE]: {
    address: {
      56: "0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07",
      97: "0x60935F36e4631F73f0f407e68642144e07aC7f5E",
    },
    identifierKey: "image",
  },
  [NftType.MIXIE]: {
    address: {
      56: "0xa251b5EAa9E67F2Bc8b33F33e20E91552Bf85566",
      97: "",
    },
    identifierKey: "otherIdentifier",
  },
};

const Nfts: Nft[] = [
  {
    name: "Mixie v1",
    description: "Stories were told, and songs were sung, about Chef Mixie’s pancakes and her big Syrup gun.",
    images: {
      lg: "mixie-1-lg.png",
      md: "mixie-1-md.png",
      sm: "mixie-1-sm.png",
      ipfs: `${IPFS_GATEWAY}/ipfs/QmQiRpr7ZMkzV7qbqVaUZ1LiuHTTdpWmapUhaY6ZGmVLQ4/001-Chef-Mixie.png`,
    },
    sortOrder: 999,
    identifier: "001-Chef-Mixie",
    type: NftType.MIXIE,
    variationId: 1,
  },
  {
    name: "Sleepy",
    description: "Aww, looks like eating pancakes all day is tough work. Sweet dreams!",
    images: {
      lg: "sleepy-lg.png",
      md: "sleepy-md.png",
      sm: "sleepy-sm.png",
      ipfs: `${IPFS_GATEWAY}/ipfs/QmYD9AtzyQPjSa9jfZcZq88gSaRssdhGmKqQifUDjGFfXm/sleepy.png`,
      blur: "sleepy-blur.png",
    },
    sortOrder: 999,
    identifier: "sleepy",
    type: NftType.PANCAKE,
    variationId: 5,
  },
  {
    name: "Swapsies",
    description: "These bunnies love nothing more than swapping pancakes. Especially on BSC.",
    images: {
      lg: "swapsies-lg.png",
      md: "swapsies-md.png",
      sm: "swapsies-sm.png",
      ipfs: `${IPFS_GATEWAY}/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/swapsies.png`,
      blur: "swapsies-blur.png",
    },
    sortOrder: 999,
    identifier: "swapsies",
    type: NftType.PANCAKE,
    variationId: 0,
  },
];

export default Nfts;
