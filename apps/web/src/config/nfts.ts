import { ASSET_CDN } from 'config/constants/endpoints'
import { Address } from 'viem'

// export const DOCKMAN_HOST = 'http://copilot.tpddns.cn:19000'
export const DOCKMAN_HOST = 'https://api.tesseract.world'

export const SEAPORT_ADDRESS = '0xFF28baa302C29cFcbe898A10d4AD4f3CA574D02F'

export const DEFAULT_NFT_IMAGE = `${ASSET_CDN}/default-nft.png`
export const DEFAULT_AVATAR = `${ASSET_CDN}/default-avatar.png`
export const DEFAULT_COLLECTION_AVATAR = `${ASSET_CDN}/default-collection-avatar-3.png`
export const DEFAULT_COLLECTION_BANNER = `${ASSET_CDN}/default-collection-banner.png`

export const RECYCLE_CONTRACT_ADDRESS = `0x5B90d4dF140a4519Df7635c88cD05138c9e5b27f` as Address

export const RECYCLE_ABI = [
  {
    inputs: [],
    name: 'peekBuybackAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'buyback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
