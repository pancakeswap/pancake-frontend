import { arbitrum, mainnet, optimism, polygon, avalanche, fantom } from 'wagmi/chains'

const VERSION = '0.0.25-mainnet.20'
const SHA384 = 'RDYGBMTG+YS5OF8Kavau0Xdyq6j7e/5bFMF55lYu3Oz3gthIOqQSSJkcz96n6knF'
export const PARTNER_ID = 0x0002
export const FEE_COLLECTOR = '0x68C7ABB8b1c3D1cE467E28265770F3a7ECF32654'
export const FEE_TENTH_BPS = '0'

export const STARGATE_JS = {
  src: `https://unpkg.com/@layerzerolabs/stargate-ui@${VERSION}/element.js`,
  integrity: `sha384-${SHA384}`,
}

export const CHAINS_STARGATE = [mainnet, arbitrum, optimism, polygon, avalanche, fantom]
