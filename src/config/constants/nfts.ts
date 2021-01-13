import { Nft } from './types'

export const RABBIT_MINTING_FARM_ADDRESS = '0x7c8b60d2b859a38c8B9b5B6CB4565485cb637c7a'
export const PANCAKE_RABBITS_ADDRESS = '0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07'

const Nfts: Nft[] = [
  {
    name: 'Swapsies',
    description: 'These bunnies love nothing more than swapping pancakes. Especially on BSC.',
    originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/swapsies.png',
    previewImage: 'swapsies-preview.png',
    blurImage: 'swapsies-blur.png',
    sortOrder: 999,
    bunnyId: 0,
  },
  {
    name: 'Drizzle',
    description: "It's raining syrup on this bunny, but he doesn't seem to mind. Can you blame him?",
    originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/drizzle.png',
    previewImage: 'drizzle-preview.png',
    blurImage: 'drizzle-blur.png',
    sortOrder: 999,
    bunnyId: 1,
  },
  {
    name: 'Blueberries',
    description: "These bunnies like their pancakes with blueberries. What's your favorite topping?",
    originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/blueberries.png',
    previewImage: 'blueberries-preview.png',
    blurImage: 'blueberries-blur.png',
    sortOrder: 999,
    bunnyId: 2,
  },
  {
    name: 'Circular',
    description: "Love makes the world go 'round... but so do pancakes. And these bunnies know it.",
    originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/circular.png',
    previewImage: 'circular-preview.png',
    blurImage: 'circular-blur.png',
    sortOrder: 999,
    bunnyId: 3,
  },
  {
    name: 'Sparkle',
    description: 'It’s sparkling syrup, pancakes, and even lottery tickets! This bunny really loves it.',
    originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/sparkle.png',
    previewImage: 'sparkle-preview.png',
    blurImage: 'sparkle-blur.png',
    sortOrder: 999,
    bunnyId: 4,
  },
]

export default Nfts
