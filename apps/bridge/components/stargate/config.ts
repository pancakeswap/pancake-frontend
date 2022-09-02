import { avalandche, fantomOpera } from '@pancakeswap/wagmi/chains'
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains'

const VERSION = '0.0.25-mainnet.18'
const SHA384 = '5qByPFCg/LiF1jv/KlCHDgn1H8gLLLoYFFSoNSY6kMc0jWTU9NvHVyDmj4unccQ/'
export const PARTNER_ID = 0x0002
export const FEE_COLLECTOR = '0x68C7ABB8b1c3D1cE467E28265770F3a7ECF32654'
export const FEE_TENTH_BPS = '40'

export const STARGATE_JS = {
  src: `https://unpkg.com/@layerzerolabs/stargate-ui@${VERSION}/element.js`,
  integrity: `sha384-${SHA384}`,
}

export const CHAINS_STARGATE = [mainnet, arbitrum, optimism, polygon, avalandche, fantomOpera]
