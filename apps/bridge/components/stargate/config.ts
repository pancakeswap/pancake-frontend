import { arbitrum, mainnet, optimism, polygon, avalanche, fantom } from 'viem/chains'

const VERSION = '0.0.27'
const SHA384 = 'ZWUQEUGzdCAFC3Dch9zkGZQawEKOjOytxBQfPjasDDgGCWyR+njzQ9rOW8a/F8LK'
export const PARTNER_ID = 0x0002
export const FEE_COLLECTOR = '0x68C7ABB8b1c3D1cE467E28265770F3a7ECF32654'
export const FEE_TENTH_BPS = '0'

export const STARGATE_JS = {
  src: `https://unpkg.com/@layerzerolabs/stargate-ui@${VERSION}/element.js`,
  integrity: `sha384-${SHA384}`,
}

export const CHAINS_STARGATE = [mainnet, arbitrum, optimism, polygon, avalanche, fantom]
