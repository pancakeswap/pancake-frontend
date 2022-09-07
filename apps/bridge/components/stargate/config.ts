import { avalandche, fantomOpera } from '@pancakeswap/wagmi/chains'
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains'

const VERSION = '0.0.25-mainnet.19'
const SHA384 = 'qQJSEss4ErEoxG1BxX9kq5sOqbBAn475yj7Bz8ZqNxQKDR2tvk693RdhfA0blQEF'
export const PARTNER_ID = 0x0002
export const FEE_COLLECTOR = '0x68C7ABB8b1c3D1cE467E28265770F3a7ECF32654'
export const FEE_TENTH_BPS = '40'

export const STARGATE_JS = {
  src: `https://unpkg.com/@layerzerolabs/stargate-ui@${VERSION}/element.js`,
  integrity: `sha384-${SHA384}`,
}

export const CHAINS_STARGATE = [mainnet, arbitrum, optimism, polygon, avalandche, fantomOpera]
