// import { ASSET_CDN } from "config/constants/endpoints"
import Image from 'next/image'
import { isChainSupported } from 'utils/wagmi'

export type NetworkLogoTheme = 'default' | 'colored' | 'pure-black'

export const NetworkLogo: React.FC<{
  chainId: number
  width?: number
  height?: number
  type?: NetworkLogoTheme
}> = ({ chainId, width = 24, height = 24, type = 'default' }) => {
  if (isChainSupported(chainId)) {
    return (
      <Image
        alt={`chain-${chainId}`}
        style={{ maxHeight: `${height}px` }}
        src={`/images/networks/${type}/${chainId}.png`}
        width={width}
        height={height}
        unoptimized
      />
    )
  }

  return null
}
