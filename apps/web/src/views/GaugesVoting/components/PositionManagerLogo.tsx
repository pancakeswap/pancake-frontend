import { Image } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

export const Logos = {
  BRIL: `${ASSET_CDN}/web/position-managers/BRIL.png`,
  RANGE: `${ASSET_CDN}/web/position-managers/RANGE.png`,
  DEFIEDGE: `${ASSET_CDN}/web/position-managers/DEFIEDGE.png`,
}

const ManagerLogo = styled(Image)`
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  margin-right: 4px;
`

export const PositionManagerLogo: React.FC<{ manager: string }> = ({ manager }) => {
  if (Logos[manager as keyof typeof Logos] === undefined) {
    return null
  }

  return <ManagerLogo src={Logos[manager as keyof typeof Logos]} alt={manager} width={16} height={16} />
}
