import { Nft } from './types'

export const RABBIT_MINTING_FARM_ADDRESS = '0x0f138e84341a4Ec0306C9Acc77e6fDF6385B8a34'
export const PANCAKE_RABBITS_ADDRESS = '0xC3c5675130cb075DE8a782Cdc1fc67B9a382145e'

const Nfts: Nft[] = [
  {
    name: 'Swapsies',
    previewImage: 'swapsies-preview.png',
    blurImage: 'swapsies-blur.png',
    sortOrder: 999,
    serialNumber: 0,
  },
  {
    name: 'Drizzle',
    previewImage: 'drizzle-preview.png',
    blurImage: 'drizzle-blur.png',
    sortOrder: 999,
    serialNumber: 1,
  },
  {
    name: 'Blueberries',
    previewImage: 'blueberries-preview.png',
    blurImage: 'blueberries-blur.png',
    sortOrder: 999,
    serialNumber: 2,
  },
  {
    name: 'Circular',
    previewImage: 'circular-preview.png',
    blurImage: 'circular-blur.png',
    sortOrder: 999,
    serialNumber: 3,
  },
  {
    name: 'Sparkle',
    previewImage: 'sparkle-preview.png',
    blurImage: 'sparkle-blur.png',
    sortOrder: 999,
    serialNumber: 4,
  },
]

export default Nfts
